from flask import Flask, request, jsonify
import cv2
import numpy as np
import mediapipe as mp
import base64
from flask_cors import CORS
import traceback
import math
from rembg import remove
from flask_socketio import SocketIO, emit

# Initialize Flask app and Socket.IO
app = Flask(__name__)
CORS(app, resources={r"/tryon": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize Mediapipe solutions
mp_face_mesh = mp.solutions.face_mesh
mp_pose = mp.solutions.pose
face_mesh = mp_face_mesh.FaceMesh()
pose = mp_pose.Pose()

def base64_to_image(base64_string):
    """Convert base64 string to OpenCV image."""
    img_data = base64.b64decode(base64_string.split(',')[-1])
    np_arr = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

def image_to_base64(image):
    """Convert OpenCV image to base64 string."""
    _, buffer = cv2.imencode('.jpg', image)
    return "data:image/jpeg;base64," + base64.b64encode(buffer).decode('utf-8')

def remove_bg(image):
    """Remove background from an image using rembg, ensuring non-empty output."""
    img = remove(image)
    return img if img is not None and img.size > 0 else image  # Return original if empty

def rotate_image(image, angle):
    """Rotate image by angle in degrees."""
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    return rotated

def overlay_glasses(user_image, glasses_image, scale_factor=1.5):
    """Overlay glasses while keeping the user’s face and background intact with head alignment."""
    user_image_rgb = cv2.cvtColor(user_image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(user_image_rgb)

    if results.multi_face_landmarks:
        face_landmarks = results.multi_face_landmarks[0]
        ih, iw, _ = user_image.shape

        # Get key landmarks for fitting glasses
        left_eye_outer = face_landmarks.landmark[33]
        right_eye_outer = face_landmarks.landmark[263]
        left_eye_top = face_landmarks.landmark[159]
        right_eye_top = face_landmarks.landmark[386]
        nose_bridge = face_landmarks.landmark[168]

        # Compute eye width for scaling glasses
        eye_width = (right_eye_outer.x - left_eye_outer.x) * iw
        new_left_x = int((left_eye_outer.x * iw) - (eye_width * (scale_factor - 1) / 2))
        new_right_x = int((right_eye_outer.x * iw) + (eye_width * (scale_factor - 1) / 2))

        # Compute glasses height based on eye and nose position
        top_y = int(min(left_eye_top.y, right_eye_top.y) * ih - 40)
        bottom_y = int(nose_bridge.y * ih + 45)

        # Resize glasses to fit
        glasses_width = new_right_x - new_left_x
        glasses_height = bottom_y - top_y
        resized_glasses = cv2.resize(glasses_image, (glasses_width, glasses_height), interpolation=cv2.INTER_AREA)

        # Convert glasses image to BGRA if needed
        if resized_glasses.shape[2] == 3:  
            resized_glasses = cv2.cvtColor(resized_glasses, cv2.COLOR_BGR2BGRA)

        # --- Adjust for head tilt ---
        # Calculate the tilt angle using the eye tops
        dy = (right_eye_top.y - left_eye_top.y) * ih
        dx = (right_eye_top.x - left_eye_top.x) * iw
        angle = math.degrees(math.atan2(dy, dx))
        rotated_glasses = rotate_image(resized_glasses, angle)

        # Create a copy of the original image and ensure BGRA format
        original_background = user_image.copy()
        if user_image.shape[2] == 3:
            user_image = cv2.cvtColor(user_image, cv2.COLOR_BGR2BGRA)
        if original_background.shape[2] == 3:
            original_background = cv2.cvtColor(original_background, cv2.COLOR_BGR2BGRA)

        # Extract alpha channel from rotated glasses
        glasses_alpha = rotated_glasses[:, :, 3] / 255.0

        # Calculate region of interest (ensure bounds)
        roi_h, roi_w = rotated_glasses.shape[:2]
        end_y = min(top_y + roi_h, ih)
        end_x = min(new_left_x + roi_w, iw)
        start_y = max(top_y, 0)
        start_x = max(new_left_x, 0)

        # Adjust glasses region if partially outside
        overlay_glasses_crop = rotated_glasses[0:(end_y - start_y), 0:(end_x - start_x)]
        alpha_crop = glasses_alpha[0:(end_y - start_y), 0:(end_x - start_x)]
        user_crop = user_image[start_y:end_y, start_x:end_x]

        # Blend the glasses with the user image
        for c in range(0, 3):
            user_crop[:, :, c] = (alpha_crop * overlay_glasses_crop[:, :, c] +
                                  (1 - alpha_crop) * user_crop[:, :, c])
        user_image[start_y:end_y, start_x:end_x] = user_crop

        # Restore any fully transparent areas with the original background
        no_glasses_mask = (user_image[:, :, 3] == 0)
        if no_glasses_mask.any():
            user_image[no_glasses_mask] = original_background[no_glasses_mask]

        final_image = cv2.cvtColor(user_image, cv2.COLOR_BGRA2BGR)
        return final_image

    return user_image

def overlay_shirt(user_image, shirt_image, scale_factor=1.4, height_adjust=0.1):
    """Overlay a shirt on a user while preserving original colors."""
    user_image_rgb = cv2.cvtColor(user_image, cv2.COLOR_BGR2RGB)
    results = pose.process(user_image_rgb)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
        left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
        right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
        
        # Calculate positions
        ih, iw, _ = user_image.shape
        shoulder_distance = (right_shoulder.x - left_shoulder.x) * iw
        new_left_x = (left_shoulder.x * iw) - (shoulder_distance * (scale_factor - 1) / 2)
        new_right_x = (right_shoulder.x * iw) + (shoulder_distance * (scale_factor - 1) / 2)
        
        mid_shoulder = ((left_shoulder.x + right_shoulder.x) / 2, (left_shoulder.y + right_shoulder.y) / 2)
        mid_hip = ((left_hip.x + right_hip.x) / 2, (left_hip.y + right_hip.y) / 2)
        third_point = (mid_shoulder[0], mid_hip[1] + height_adjust)

        src_points = np.array([
            [0, 0],
            [shirt_image.shape[1], 0],
            [shirt_image.shape[1] // 2, shirt_image.shape[0]]
        ], dtype=np.float32)

        dst_points = np.array([
            [new_left_x, left_shoulder.y * ih - (height_adjust * ih)],
            [new_right_x, right_shoulder.y * ih - (height_adjust * ih)],
            [third_point[0] * iw, third_point[1] * ih]
        ], dtype=np.float32)

        # Transform shirt image
        M = cv2.getAffineTransform(src_points, dst_points)
        warped_shirt = cv2.warpAffine(shirt_image, M, (iw, ih), flags=cv2.INTER_LINEAR)
        
        # Resize warped shirt to match user image dimensions
        warped_shirt = cv2.resize(warped_shirt, (iw, ih))

        # Convert warped shirt to grayscale and create a mask
        gray = cv2.cvtColor(warped_shirt, cv2.COLOR_BGR2GRAY)
        _, mask = cv2.threshold(gray, 1, 255, cv2.THRESH_BINARY)

        # Resize mask to ensure consistency
        mask = cv2.resize(mask, (iw, ih))
        mask_inv = cv2.bitwise_not(mask)

        # Ensure the user image has the correct number of channels
        if user_image.shape[-1] == 4:
            user_image = cv2.cvtColor(user_image, cv2.COLOR_BGRA2BGR)
        
        # Extract regions
        user_bg = cv2.bitwise_and(user_image, user_image, mask=mask_inv)  # Keep user image
        shirt_fg = cv2.bitwise_and(warped_shirt, warped_shirt, mask=mask)  # Keep only shirt

        # Ensure same number of channels before merging
        if user_bg.shape[-1] != 3:
            user_bg = cv2.cvtColor(user_bg, cv2.COLOR_BGRA2BGR)
        if shirt_fg.shape[-1] != 3:
            shirt_fg = cv2.cvtColor(shirt_fg, cv2.COLOR_BGRA2BGR)

        # Merge images safely
        result = cv2.add(user_bg, shirt_fg)

        return result

    return user_image

@app.route('/tryon', methods=['POST'])
def try_on():
    """Handle try-on API request."""
    try:
        data = request.get_json()
        if not data or 'userImage' not in data or 'productImage' not in data or 'category' not in data:
            return jsonify({'error': 'Missing required fields'}), 400

        user_image = base64_to_image(data['userImage'])
        product_image = base64_to_image(data['productImage'])
        product_image = remove_bg(product_image)

        if data['category'] == "glasses":
            result_image = overlay_glasses(user_image, product_image)
        elif data['category'] == "men" or data['category'] == "women":
            result_image = overlay_shirt(user_image, product_image)
        else:
            return jsonify({'error': 'Invalid category'}), 400

        result_base64 = image_to_base64(result_image)
        return jsonify({'resultImage': result_base64}), 200

    except Exception as e:
        print("Error in /tryon:", e)
        print(traceback.format_exc()) 
        return jsonify({'error': str(e)}), 500

# Socket.IO event for real-time updates
@socketio.on('tryon_request')
def handle_tryon_request(data):
    try:
        user_image = base64_to_image(data['userImage'])
        product_image = base64_to_image(data['productImage'])
        product_image = remove_bg(product_image)

        if data['category'] == "glasses":
            result_image = overlay_glasses(user_image, product_image)
        elif data['category'] == "men" or data['category'] == "women":
            result_image = overlay_shirt(user_image, product_image)
        else:
            emit('tryon_error', {'error': 'Invalid category'})
            return

        result_base64 = image_to_base64(result_image)
        emit('tryon_result', {'resultImage': result_base64})

    except Exception as e:
        print("Error in tryon_request:", e)
        emit('tryon_error', {'error': str(e)})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)