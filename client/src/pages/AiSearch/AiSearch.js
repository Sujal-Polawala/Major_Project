import React, { useState } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import AISearch from "../../components/AiProductSearch/aiSearch";

const Aisearch = () => {
    const [prevLocation] = useState("");

    return (
        <div className="max-w-container mx-auto p-4">
            <Breadcrumbs title="AI Searched Products" prevLocation={prevLocation} />
            <div className="pb-10">
                <AISearch />
            </div>
        </div>
    );
};

export default Aisearch;
