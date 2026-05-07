module.exports = [
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "auth",
    ()=>auth,
    "computeAge",
    ()=>computeAge,
    "guid",
    ()=>guid
]);
const API_BASE = '/api';
async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    });
    return res.json();
}
const api = {
    login: (username, password)=>apiFetch('/ajax/login', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }),
    register: (data)=>apiFetch('/ajax/register', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    getUsers: ()=>apiFetch('/users'),
    getUser: (username)=>apiFetch(`/users/${username}`),
    updateUser: (username, data)=>apiFetch(`/users/${username}/update`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    deleteUser: (username)=>apiFetch('/users/delete', {
            method: 'POST',
            body: JSON.stringify({
                username
            })
        })
};
const auth = {
    getToken: ()=>("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null,
    setToken: (token)=>localStorage.setItem('token', token),
    removeToken: ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('usertype');
    },
    getUsername: ()=>("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null,
    setUsername: (u)=>localStorage.setItem('username', u),
    setUsertype: (t)=>localStorage.setItem('usertype', t),
    isAuthenticated: ()=>{
        const t = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
        return t !== null && t !== '';
    }
};
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
}
function computeAge(birthday) {
    const dob = new Date(birthday);
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    return `${years} yrs, ${months} mos, ${days} days`;
}
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function RootPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"].isAuthenticated()) {
            router.replace('/home');
        } else {
            router.replace('/login');
        }
    }, [
        router
    ]);
    return null;
}
}),
];

//# sourceMappingURL=_0jke.2y._.js.map