// import { createRouter, createWebHistory } from 'vue-router';
// import Login from '../views/Login.vue';
// import Register from '../views/Register.vue'; // 👈 1. Register Page Import karein
// import Dashboard from '../views/Dashboard.vue';
// import AdminDashboard from '../views/AdminDashboard.vue'; // 👈 Import admin page
// import Categories from '../views/Categories.vue'; // 👈 Naya Import
// import Transactions from '../views/Transactions.vue'; // Direct consistency import
// import Profile from '../views/Profile.vue'; // Direct consistency import
// import Goals from '../views/GoalsView.vue'; // Goals page link inject kiya
// import ForgotPassword from '../views/ForgotPassword.vue';
// import ResetPassword from '../views/ResetPassword.vue';
// import ContactUs from '../views/ContactUs.vue'; // 👈 Import karein

// const routes = [
//     {
//         path: '/',
//         name: 'Login',
//         component: Login,
//         meta: { guest: true }
//     },
//     {
//         path: '/register', // 👈 2. Register Route Add karein
//         name: 'Register',
//         component: Register
//     },
//     {
//         path: '/dashboard',
//         name: 'Dashboard',
//         component: Dashboard,
//         meta: { requiresAuth: true }
//     },
//     // 👑 Admin Control Panel secure view link definition
//     { 
//         path: '/admin', 
//         name: 'AdminDashboard',
//         component: AdminDashboard, 
//         meta: { requiresAdmin: true, requiresAdmin: true } // 👈
//     },
//     {
//         path: '/categories',
//         name: 'Categories',
//         component: Categories, // 👈 Naya Route
//         meta: { requiresAuth: true }
//     },
//     {
//         path: '/transactions',
//         name: 'Transactions',
//         component: Transactions,
//         meta: { requiresAuth: true }
//     },
//     {
//         path: '/goals',
//         component: Goals,
//         name: 'goals',
//         meta: { requiresAuth: true } // 👈 Yeh line add kar dein taake bina login koi access na kare
//     },
//     {
//         path: '/profile',
//         name: 'Profile',
//         component: Profile,
//         meta: { requiresAuth: true }
//     },
//     {
//         path: '/settings/system',
//         name: 'SystemSettings',
//         component: Profile, // Same instance call
//         meta: { requiresAuth: true }
//     },
//     {
//         path: '/forgot-password',
//         name: 'ForgotPassword',
//         component: ForgotPassword,
//         meta: { hideNavbar: true }
//     },
//     {
//         path: '/reset-password',
//         name: 'ResetPassword',
//         component: ResetPassword,
//         meta: { hideNavbar: true }
//     },
//     {
//         path: '/contact-us',
//         name: 'ContactUs',
//         component: ContactUs,
//         meta: { hideNavbar: true }
//     }
// ];

// const router = createRouter({
//     history: createWebHistory(),
//     routes
// });

// // Middleware Guard: Protect Routes
// router.beforeEach((to, from) => {
//     const token = localStorage.getItem('token');
//     const userRole = localStorage.getItem('user_role');
    
//    // 1. Unauthenticated users ko login par bhejein
//     if (to.meta.requiresAuth && !token) {
//         return { name: 'Login' }; 
//     }
    
//     // 2. Already logged in users ko login/register page par jaane se rokein
//     if (to.meta.guest && token) {
//         // Agar admin logged in hy to use admin dashboard bhejein, warna normal dashboard
//         if (userRole === 'Admin') {
//             return { name: 'AdminDashboard' }; // Aapke admin route ka jo bhi name hy
//         }
//         return { name: 'Dashboard' }; 
//     }

//     // 👑 3. ADMIN SECURITY LAYER: Agar route sirf admin ke liye hy aur user admin nahi hy
//     if (to.meta.requiresAdmin && userRole !== 'Admin') {
//         return { name: 'Dashboard' }; // Normal user dashboard par redirect kar dein
//     }
// });

// export default router;


// import UserLayout from '../layouts/UserLayout.vue'; // Isme normal user ka navbar hoga
// import AdminLayout from '../layouts/AdminLayout.vue'; // Isme admin ka apna exclusive navbar hoga
// import Login from '../views/Login.vue';

// const routes = [
//     // 🚪 Public/Guest Routes (No Navbar)
//     { path: '/', name: 'Login', component: Login, meta: { guest: true } },

//     // 👤 Normal Users Pipeline (Uses UserLayout)
//     {
//         path: '/dashboard',
//         component: UserLayout, // 👈 Iske andar normal user ka navbar load hoga
//         meta: { requiresAuth: true },
//         children: [
//             { path: '', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
//             { path: '/categories', name: 'Categories', component: () => import('../views/Categories.vue') },
//             { path: '/transactions', name: 'Transactions', component: () => import('../views/Transactions.vue') },
//             { path: '/goals', name: 'Goals', component: () => import('../views/GoalsView.vue') },
//         ]
//     },

//     // 👑 Admin Panel Pipeline (Uses AdminLayout)
//     {
//         path: '/admin',
//         component: AdminLayout, // 👈 Iske andar Admin ka apna alag layout aur sidebar/navbar hoga
//         meta: { requiresAuth: true, requiresAdmin: true },
//         children: [
//             { path: '', name: 'AdminDashboard', component: () => import('../views/AdminDashboard.vue') },
//             { path: 'users', name: 'AdminUsers', component: () => import('../views/AdminUsers.vue') },
//             { path: 'tickets', name: 'AdminTickets', component: () => import('../views/AdminTickets.vue') },
//         ]
//     }
// ];


import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import UserLayout from '../layouts/UserLayout.vue';      // 👈 Import User Layout
import AdminLayout from '../layouts/AdminLayout.vue';    // 👈 Import Admin Layout

const routes = [
    // 🚪 Guest Pipelines
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: { guest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { guest: true }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/ForgotPassword.vue')
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: () => import('../views/ResetPassword.vue')
    },
    {
        path: '/contact-us',
        name: 'ContactUs',
        component: () => import('../views/ContactUs.vue')
    },

    // 👤 Normal Authenticated Users Routes (Nested under UserLayout)
    {
        path: '/dashboard',
        component: UserLayout, // 👈 Sab ka standard top user navbar yahan se milega
        meta: { requiresAuth: true },
        children: [
            {
                path: '', // Iska matlab hy URL hoga `/dashboard`
                name: 'Dashboard',
                component: () => import('../views/Dashboard.vue')
            },
            {
                path: '/categories',
                name: 'Categories',
                component: () => import('../views/Categories.vue')
            },
            {
                path: '/transactions',
                name: 'Transactions',
                component: () => import('../views/Transactions.vue')
            },
            {
                path: '/goals',
                name: 'goals',
                component: () => import('../views/GoalsView.vue')
            },
            {
                path: '/profile',
                name: 'Profile',
                component: () => import('../views/Profile.vue')
            },
            {
                path: '/support',
                name: 'Support',
                component: () => import('../views/UserSupport.vue'),
                meta: { requiresAuth: true } // Agar aapne auth middleware setup kiya hua hy vue router me
            }
        ]
    },

    // 👑 Admin Core Protected Routes (Nested under AdminLayout)
    {
        path: '/admin',
        component: AdminLayout, // 👈 Admin ka dark/purple theme corporate design yahan se chalega
        meta: { requiresAuth: true, requiresAdmin: true },
        children: [
            {
                path: '', // Iska matlab hy URL hoga `/admin`
                name: 'AdminDashboard',
                component: () => import('../views/AdminDashboard.vue')
            },
            {
                path: 'profile', // URL banega: /admin/profile
                name: 'AdminProfile',
                component: () => import('../views/AdminProfile.vue')
            },
            {
                path: 'settings', // URL banega: /admin/settings
                name: 'AdminSettings',
                component: () => import('../views/AdminSettings.vue')
            }
            // Future admin screens (e.g. users management) yahan children array me asani se add ho sakti hain
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 🛡️ Middleware Router Guards Engine
router.beforeEach((to, from) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('user_role')?.toLowerCase();
    
    if (to.meta.requiresAuth && !token) {
        return { name: 'Login' }; 
    }
    
    if (to.meta.guest && token) {
        if (userRole === 'admin') {
            return { name: 'AdminDashboard' }; 
        }
        return { name: 'Dashboard' }; 
    }

    if (to.meta.requiresAdmin && userRole !== 'admin') {
        return { name: 'Dashboard' }; 
    }
});

export default router;