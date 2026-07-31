import re

def patch(path, replacements):
    with open(path) as f:
        content = f.read()
    for old, new in replacements:
        if old not in content:
            raise SystemExit(f"ERROR: expected text not found in {path}:\n{old!r}")
        content = content.replace(old, new)
    with open(path, "w") as f:
        f.write(content)
    print(f"{path} updated successfully")


# --- package.json: point proxy at our Flask API ---
patch("package.json", [
    ('"proxy": "http://localhost:5555",', '"proxy": "http://localhost:5000",'),
])


# --- App.js: use /api/auth/me, unwrap {"user": {...}} response ---
patch("src/components/App.js", [
    ('fetch("/me", {', 'fetch("/api/auth/me", {'),
    (
        '      if (r.ok) {\n        r.json().then((user) => setUser(user));\n      }',
        '      if (r.ok) {\n        r.json().then((data) => setUser(data.user));\n      }',
    ),
])


# --- LoginForm.js: use /api/auth/login, access_token field, single error string ---
patch("src/components/LoginForm.js", [
    ('fetch("/login", {', 'fetch("/api/auth/login", {'),
    (
        '      if (r.ok) {\n        r.json().then(({token, user}) => onLogin(token, user));\n      } else {\n        r.json().then((err) => setErrors(err.errors));\n      }',
        '      if (r.ok) {\n        r.json().then(({access_token, user}) => onLogin(access_token, user));\n      } else {\n        r.json().then((err) => setErrors([err.error]));\n      }',
    ),
])


# --- SignUpForm.js: add email field, use /api/auth/signup, fix response/error shape ---
patch("src/components/SignUpForm.js", [
    (
        '  const [username, setUsername] = useState("");\n  const [password, setPassword] = useState("");',
        '  const [username, setUsername] = useState("");\n  const [email, setEmail] = useState("");\n  const [password, setPassword] = useState("");',
    ),
    (
        '''  function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        password_confirmation: passwordConfirmation
      }),
    }).then((r) => {
      setIsLoading(false);
      if (r.ok) {
        r.json().then(({token, user}) => onLogin(token, user));
      } else {
        r.json().then((err) => setErrors(err.errors));
      }
    });
  }''',
        '''  function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);

    if (password !== passwordConfirmation) {
      setErrors(["Passwords must match"]);
      return;
    }

    setIsLoading(true);
    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    }).then((r) => {
      setIsLoading(false);
      if (r.ok) {
        r.json().then(({access_token, user}) => onLogin(access_token, user));
      } else {
        r.json().then((err) => setErrors([err.error]));
      }
    });
  }''',
    ),
    (
        '''      <FormField>
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormField>
      <FormField>
        <Label htmlFor="password">Password</Label>''',
        '''      <FormField>
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormField>
      <FormField>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField>
        <Label htmlFor="password">Password</Label>''',
    ),
])


# --- NavBar.js: actually call /api/auth/logout to revoke the token server-side ---
patch("src/components/NavBar.js", [
    (
        '''  function handleLogoutClick() {
    localStorage.removeItem("token");
    setUser(null);
  }''',
        '''  function handleLogoutClick() {
    const token = localStorage.getItem("token");
    fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).finally(() => {
      localStorage.removeItem("token");
      setUser(null);
    });
  }''',
    ),
])

print("\nAll files patched successfully.")
