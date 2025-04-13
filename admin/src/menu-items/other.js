// assets
import { Business, Category, Inventory, LocalOffer, LocalShipping, Person, ShoppingBag, ShoppingCart, Store ,  } from '@mui/icons-material';
import { IconBrandChrome, IconHelp , IconPackage , IconCategory2} from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp , IconPackage ,ShoppingCart , LocalShipping , ShoppingBag ,Person , Business , Inventory ,Store , Category ,LocalOffer};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  title: 'Pages',
  type: 'group',
  children: [
    
    {
      id: 'user',
      title: 'User List',
      type: 'item',
      url: '/user-list',
      icon: icons.Person,
      breadcrumbs: false,
      roles: [0]
    },
    {
      id: 'Seller',
      title: 'Seller List',
      type: 'item',
      url: '/seller-list',
      icon: icons.Store,
      breadcrumbs: false,
      roles: [0]
    },
    {
      id: 'Category',
      title: 'Categories ',
      type: 'item',
      url: '/categories-list',
      icon: IconCategory2,
      breadcrumbs: false,
      roles: [0]
    },
    {
      id: 'order',
      title: 'Order List',
      type: 'item',
      url: '/order-list',
      icon: icons.ShoppingCart,
      breadcrumbs: false,
      roles: [0,1]
    },
    {
      id: 'product',
      title: 'Product List',
      type: 'item',
      url: '/product-list',
      icon: icons.ShoppingBag,
      breadcrumbs: false,
      roles: [0,1]
    },
    {
      id: 'Coupon',
      title: 'Coupon',
      type: 'item',
      url: '/coupon-list',
      icon: icons.LocalOffer,
      breadcrumbs: false,
      roles: [0]
    },
    // {
    //   id: 'sample-page',
    //   title: 'Sample Page',
    //   type: 'item',
    //   url: '/sample-page',
    //   icon: icons.IconBrandChrome,
    //   breadcrumbs: false,
    //   roles: [0,1]
    // },
  ]
};

export default other;
