<Outlet /> is literally a placeholder that says: "whatever child route matched the current URL, render it here."

Concretely, trace through what happens when a logged-in user visits /dashboard:

React Router sees the URL matches /dashboard, which is nested inside <Route element={<ProtectedRoute/>}>
It renders ProtectedRoute first
ProtectedRoute checks the token, finds one, returns <Outlet />
React Router sees the <Outlet /> and substitutes in the actual matched child — in this case, your <h2>DASHBOARD</h2> element
Final rendered output: ProtectedRoute's decision passed, and the dashboard content appears where <Outlet /> was

If there'd been no token, step 3 would've returned <Navigate to="/login" replace/> instead — and the <Outlet/>/child page would never render at all.