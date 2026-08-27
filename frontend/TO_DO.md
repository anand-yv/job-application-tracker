TODO — Login.jsx & Register.jsx polish
    Loading state
        Add a loading boolean via useState(false)
        Set true right before calling auth.login()/auth.register(), false in a finally block (so it resets whether the call succeeds or fails)
        Disable the button while loading is true (disabled={loading}) and/or change button text (e.g. "Logging in..." / "Registering...")
        Prevents duplicate submissions from double-clicks or slow networks
        
    Label/input association
        Add matching htmlFor on each <label> and id on its corresponding <input>
        Example: <label htmlFor="email">Email : </label> + <input id="email" ... />
        Do this for both email and password (and confirmPassword in Register)
        Fixes: clicking label text won't focus input, screen readers can't associate them