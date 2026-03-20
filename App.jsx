import { useState, useReducer, createContext, useContext, useCallback } from "react";

/* ============================================================
   REDUX LAYER
   ============================================================ */

// -- Action Types --
const AT = {
  SET_CATEGORY: "nav/SET_CATEGORY",
  SET_SEARCH: "nav/SET_SEARCH",
  TOGGLE_SEARCH: "nav/TOGGLE_SEARCH",
  TOGGLE_SIDEBAR: "nav/TOGGLE_SIDEBAR",
  SET_SKILL_TAG: "courses/SET_SKILL_TAG",
  SET_COURSES: "courses/SET_COURSES",
  ENROLL: "courses/ENROLL",
  LOGIN: "auth/LOGIN",
  LOGOUT: "auth/LOGOUT",
  OPEN_MODAL: "ui/OPEN_MODAL",
  CLOSE_MODAL: "ui/CLOSE_MODAL",
  SET_AUTH_TAB: "ui/SET_AUTH_TAB",
  SET_NOTIFICATION: "ui/SET_NOTIFICATION",
  CLEAR_NOTIFICATION: "ui/CLEAR_NOTIFICATION",
  LOGIN_REQUEST: "auth/LOGIN_REQUEST",
  LOGIN_SUCCESS: "auth/LOGIN_SUCCESS",
  LOGIN_FAIL: "auth/LOGIN_FAIL",
  SIGNUP_REQUEST: "auth/SIGNUP_REQUEST",
  SIGNUP_SUCCESS: "auth/SIGNUP_SUCCESS",
  SIGNUP_FAIL: "auth/SIGNUP_FAIL",
  CLEAR_ERROR: "auth/CLEAR_ERROR",
};

// -- Mock DB --
const mockUsers = [
  { id: 1, name: "Alex Johnson", email: "alex@demo.com", password: "demo123", avatar: "AJ" },
];

// -- Data --
const CATEGORIES = {
  CREATE: ["Animation", "Creative Writing", "Film & Video", "Fine Art", "Graphic Design", "Illustration", "Music", "Photography", "UI/UX Design", "Web Development"],
  BUILD: ["Architecture", "Freelance & Entrepreneurship", "Industrial Design", "Interior Design", "Landscape", "Pattern Design", "Pottery"],
  THRIVE: ["Leadership & Management", "Mindfulness", "Productivity", "Writing"],
};

const SKILL_TAGS = {
  "UI/UX Design": ["Product Design", "Web Development", "Web Design", "Interaction Design", "Wireframing", "Mobile Design", "User Experience", "Prototyping", "UX Design", "UI Design"],
  "Web Development": ["JavaScript", "React", "Node.js", "CSS", "HTML", "TypeScript", "Next.js", "Vue.js", "APIs", "Full Stack"],
  "Graphic Design": ["Branding", "Typography", "Logo Design", "Color Theory", "Print Design", "Adobe Illustrator", "Photoshop", "InDesign", "Motion Graphics", "Layout"],
  "Photography": ["Portrait", "Landscape", "Street Photography", "Lightroom", "Composition", "Studio Lighting", "Photo Editing", "Wedding", "Product Photography", "Black & White"],
  "Illustration": ["Digital Illustration", "Character Design", "Procreate", "Concept Art", "Comics", "Children's Book", "Watercolor", "Vector Art", "Storyboarding", "Anime"],
};

const COURSES_DATA = [
  { id: 1, title: "Inclusive UX: Designing Websites for Everyone", instructor: "Tatiana Mac", category: "UI/UX Design", duration: "1h 12m", lessons: 14, level: "All Levels", students: 8420, rating: 4.8, isOriginal: true, tags: ["UX Design", "Web Design", "User Experience"], thumb: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop" },
  { id: 2, title: "Logo Design Fundamentals", instructor: "George Bokhua", category: "Graphic Design", duration: "2h 45m", lessons: 28, level: "Beginner", students: 22100, rating: 4.9, isOriginal: false, tags: ["Logo Design", "Branding", "Graphic Design"], thumb: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400&h=225&fit=crop" },
  { id: 3, title: "Modern React with Redux: Complete Guide", instructor: "Sarah Chen", category: "Web Development", duration: "4h 30m", lessons: 42, level: "Intermediate", students: 15600, rating: 4.7, isOriginal: false, tags: ["React", "JavaScript", "Full Stack"], thumb: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=225&fit=crop" },
  { id: 4, title: "Portrait Photography Masterclass", instructor: "Lindsay Adler", category: "Photography", duration: "3h 20m", lessons: 31, level: "Intermediate", students: 11200, rating: 4.8, isOriginal: true, tags: ["Portrait", "Studio Lighting", "Composition"], thumb: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=225&fit=crop" },
  { id: 5, title: "Digital Illustration: Characters in Procreate", instructor: "Lois van Baarle", category: "Illustration", duration: "2h 10m", lessons: 22, level: "All Levels", students: 19800, rating: 4.9, isOriginal: false, tags: ["Digital Illustration", "Procreate", "Character Design"], thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=225&fit=crop" },
  { id: 6, title: "Typography for Designers", instructor: "Ellen Lupton", category: "Graphic Design", duration: "1h 55m", lessons: 18, level: "Beginner", students: 9300, rating: 4.6, isOriginal: false, tags: ["Typography", "Layout", "Branding"], thumb: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?w=400&h=225&fit=crop" },
  { id: 7, title: "Motion Graphics in After Effects", instructor: "Jake Bartlett", category: "Animation", duration: "5h 00m", lessons: 48, level: "Advanced", students: 7800, rating: 4.7, isOriginal: true, tags: ["Motion Graphics", "Animation", "Video"], thumb: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=225&fit=crop" },
  { id: 8, title: "CSS Grid & Flexbox Complete", instructor: "Kevin Powell", category: "Web Development", duration: "3h 15m", lessons: 35, level: "Beginner", students: 18400, rating: 4.8, isOriginal: false, tags: ["CSS", "Web Design", "HTML"], thumb: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=225&fit=crop" },
  { id: 9, title: "Brand Identity Design System", instructor: "Jessica Walsh", category: "Graphic Design", duration: "2h 40m", lessons: 26, level: "Intermediate", students: 12600, rating: 4.9, isOriginal: true, tags: ["Branding", "Logo Design", "Color Theory"], thumb: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=225&fit=crop" },
];

const HERO_BANNERS = {
  "UI/UX Design": { title: "Online UI/UX Design Classes", subtitle: "Find what fascinates you as you explore these UI/UX Design classes.", gradient: "linear-gradient(to right, rgba(10,40,50,0.85) 40%, transparent 100%)", bg: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=350&fit=crop" },
  "Web Development": { title: "Online Web Development Classes", subtitle: "Build real projects with hands-on coding classes from industry experts.", gradient: "linear-gradient(to right, rgba(10,20,50,0.85) 40%, transparent 100%)", bg: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1200&h=350&fit=crop" },
  "Graphic Design": { title: "Online Graphic Design Classes", subtitle: "Express your creativity through logo, typography and brand design.", gradient: "linear-gradient(to right, rgba(50,10,30,0.85) 40%, transparent 100%)", bg: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=1200&h=350&fit=crop" },
  "Photography": { title: "Online Photography Classes", subtitle: "Capture stunning images and master lighting, composition and editing.", gradient: "linear-gradient(to right, rgba(10,10,10,0.85) 40%, transparent 100%)", bg: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&h=350&fit=crop" },
  "Illustration": { title: "Online Illustration Classes", subtitle: "Create beautiful artwork — from digital painting to character design.", gradient: "linear-gradient(to right, rgba(30,10,50,0.85) 40%, transparent 100%)", bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=350&fit=crop" },
  "default": { title: "Explore Online Classes", subtitle: "Discover thousands of classes taught by world-class instructors.", gradient: "linear-gradient(to right, rgba(10,30,40,0.9) 40%, transparent 100%)", bg: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=350&fit=crop" },
};

// -- Initial State --
const initialState = {
  nav: { activeCategory: "UI/UX Design", searchOpen: false, searchQuery: "", sidebarOpen: true },
  courses: { list: COURSES_DATA, enrolled: [], activeSkillTag: "" },
  auth: { isLoggedIn: false, user: null, loading: false, error: null },
  ui: { modal: null, authTab: "login", notification: null },
};

// -- Reducers --
function navReducer(s = initialState.nav, a) {
  switch (a.type) {
    case AT.SET_CATEGORY: return { ...s, activeCategory: a.payload, searchOpen: false };
    case AT.SET_SEARCH: return { ...s, searchQuery: a.payload };
    case AT.TOGGLE_SEARCH: return { ...s, searchOpen: !s.searchOpen, searchQuery: "" };
    case AT.TOGGLE_SIDEBAR: return { ...s, sidebarOpen: !s.sidebarOpen };
    default: return s;
  }
}
function coursesReducer(s = initialState.courses, a) {
  switch (a.type) {
    case AT.SET_SKILL_TAG: return { ...s, activeSkillTag: s.activeSkillTag === a.payload ? "" : a.payload };
    case AT.ENROLL: return { ...s, enrolled: s.enrolled.includes(a.payload) ? s.enrolled : [...s.enrolled, a.payload] };
    default: return s;
  }
}
function authReducer(s = initialState.auth, a) {
  switch (a.type) {
    case AT.LOGIN_REQUEST: case AT.SIGNUP_REQUEST: return { ...s, loading: true, error: null };
    case AT.LOGIN_SUCCESS: case AT.SIGNUP_SUCCESS: return { isLoggedIn: true, user: a.payload, loading: false, error: null };
    case AT.LOGIN_FAIL: case AT.SIGNUP_FAIL: return { ...s, loading: false, error: a.payload };
    case AT.LOGOUT: return { isLoggedIn: false, user: null, loading: false, error: null };
    case AT.CLEAR_ERROR: return { ...s, error: null };
    default: return s;
  }
}
function uiReducer(s = initialState.ui, a) {
  switch (a.type) {
    case AT.OPEN_MODAL: return { ...s, modal: a.payload };
    case AT.CLOSE_MODAL: return { ...s, modal: null };
    case AT.SET_AUTH_TAB: return { ...s, authTab: a.payload };
    case AT.SET_NOTIFICATION: return { ...s, notification: a.payload };
    case AT.CLEAR_NOTIFICATION: return { ...s, notification: null };
    default: return s;
  }
}
function rootReducer(s = initialState, a) {
  return { nav: navReducer(s.nav, a), courses: coursesReducer(s.courses, a), auth: authReducer(s.auth, a), ui: uiReducer(s.ui, a) };
}

// -- Store --
const StoreCtx = createContext(null);
function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const dispatchThunk = useCallback((action) => {
    if (typeof action === "function") action(dispatchThunk, () => state);
    else dispatch(action);
  }, [state]);
  return <StoreCtx.Provider value={{ state, dispatch: dispatchThunk }}>{children}</StoreCtx.Provider>;
}
const useSelector = (fn) => fn(useContext(StoreCtx).state);
const useDispatch = () => useContext(StoreCtx).dispatch;

// -- Selectors --
const sel = {
  filteredCourses: (s) => {
    const cat = s.nav.activeCategory;
    const tag = s.courses.activeSkillTag;
    const q = s.nav.searchQuery.toLowerCase();
    return s.courses.list.filter(c => {
      const matchCat = !cat || c.category === cat;
      const matchTag = !tag || c.tags.includes(tag);
      const matchQ = !q || c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q);
      return matchCat && matchTag && matchQ;
    });
  },
};

// -- Thunks --
let notifTimer;
const thunks = {
  notify: (msg, type = "success") => (dispatch) => {
    if (notifTimer) clearTimeout(notifTimer);
    dispatch({ type: AT.SET_NOTIFICATION, payload: { msg, type } });
    notifTimer = setTimeout(() => dispatch({ type: AT.CLEAR_NOTIFICATION }), 3500);
  },
  login: (email, password) => (dispatch) => {
    dispatch({ type: AT.LOGIN_REQUEST });
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (user) {
        const { password: _, ...safe } = user;
        dispatch({ type: AT.LOGIN_SUCCESS, payload: safe });
        dispatch({ type: AT.CLOSE_MODAL });
        thunks.notify("Welcome back, " + safe.name + "! 👋")(dispatch);
      } else {
        dispatch({ type: AT.LOGIN_FAIL, payload: "Invalid email or password." });
      }
    }, 500);
  },
  signup: (name, email, password) => (dispatch) => {
    dispatch({ type: AT.SIGNUP_REQUEST });
    setTimeout(() => {
      if (mockUsers.find(u => u.email === email)) {
        dispatch({ type: AT.SIGNUP_FAIL, payload: "Email already registered." }); return;
      }
      const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      const newUser = { id: mockUsers.length + 1, name, email, password, avatar: initials };
      mockUsers.push(newUser);
      const { password: _, ...safe } = newUser;
      dispatch({ type: AT.SIGNUP_SUCCESS, payload: safe });
      dispatch({ type: AT.CLOSE_MODAL });
      thunks.notify("Account created! Welcome to SkillLearn 🎉")(dispatch);
    }, 600);
  },
  enroll: (course) => (dispatch, getState) => {
    if (!getState().auth.isLoggedIn) { dispatch({ type: AT.OPEN_MODAL, payload: "auth" }); return; }
    dispatch({ type: AT.ENROLL, payload: course.id });
    thunks.notify(`Enrolled in "${course.title}"!`)(dispatch);
  },
};

/* ============================================================
   COMPONENTS
   ============================================================ */

// Notification Toast
function Toast() {
  const notif = useSelector(s => s.ui.notification);
  if (!notif) return null;
  const colors = { success: "#00c853", error: "#f44336", info: "#2196f3" };
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 9999,
      background: colors[notif.type] || colors.success,
      color: "#fff", padding: "12px 20px", borderRadius: 6,
      fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14,
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      animation: "fadeSlide 0.3s ease",
    }}>{notif.msg}</div>
  );
}

// Auth Modal
function AuthModal() {
  const dispatch = useDispatch();
  const modal = useSelector(s => s.ui.modal);
  const tab = useSelector(s => s.ui.authTab);
  const { loading, error } = useSelector(s => s.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("alex@demo.com");
  const [pw, setPw] = useState("demo123");
  const [pw2, setPw2] = useState("");
  const [localErr, setLocalErr] = useState("");
  if (modal !== "auth") return null;

  const isLogin = tab === "login";
  const close = () => { dispatch({ type: AT.CLOSE_MODAL }); dispatch({ type: AT.CLEAR_ERROR }); setLocalErr(""); };
  const switchTab = (t) => { dispatch({ type: AT.SET_AUTH_TAB, payload: t }); setLocalErr(""); dispatch({ type: AT.CLEAR_ERROR }); };

  const handleSubmit = (e) => {
    e.preventDefault(); setLocalErr(""); dispatch({ type: AT.CLEAR_ERROR });
    if (!isLogin) {
      if (name.trim().length < 2) { setLocalErr("Name too short."); return; }
      if (pw !== pw2) { setLocalErr("Passwords don't match."); return; }
      if (pw.length < 6) { setLocalErr("Password needs 6+ characters."); return; }
      dispatch(thunks.signup(name.trim(), email.trim(), pw));
    } else {
      dispatch(thunks.login(email.trim(), pw));
    }
  };

  const inp = { width: "100%", padding: "11px 14px", borderRadius: 6, border: "1.5px solid #e0e0e0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 14, transition: "border-color 0.2s" };
  const displayError = localErr || error;

  return (
    <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 12, width: "100%", maxWidth: 420,
        padding: "36px 36px 32px", fontFamily: "'DM Sans', sans-serif",
        animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#0a2030", letterSpacing: -1 }}>
            Skill<span style={{ color: "#00c853" }}>Learn</span>.
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #f0f0f0", marginBottom: 24 }}>
          {["login", "signup"].map(t => (
            <button key={t} onClick={() => switchTab(t)} style={{
              flex: 1, padding: "10px", border: "none", background: "none",
              fontFamily: "inherit", fontWeight: 700, fontSize: 15, cursor: "pointer",
              color: tab === t ? "#0a2030" : "#999",
              borderBottom: tab === t ? "2px solid #00c853" : "2px solid transparent",
              marginBottom: -2, transition: "all 0.2s",
            }}>{t === "login" ? "Sign In" : "Create Account"}</button>
          ))}
        </div>

        {isLogin && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#166534" }}>
            Demo: <strong>alex@demo.com</strong> / <strong>demo123</strong>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && <input style={inp} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />}
          <input style={inp} type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={inp} type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} required />
          {!isLogin && <input style={inp} type="password" placeholder="Confirm Password" value={pw2} onChange={e => setPw2(e.target.value)} required />}

          {displayError && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 6, padding: "10px 14px", fontSize: 13, marginBottom: 14 }}>⚠ {displayError}</div>}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "13px", borderRadius: 6, border: "none",
            background: loading ? "#86efac" : "#00c853", color: "#fff",
            fontFamily: "inherit", fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer",
            transition: "background 0.2s",
          }}>
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>
        <button onClick={close} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999" }}>✕</button>
      </div>
    </div>
  );
}

// Top Navbar
function Navbar() {
  const dispatch = useDispatch();
  const { searchOpen, searchQuery } = useSelector(s => s.nav);
  const { isLoggedIn, user } = useSelector(s => s.auth);

  return (
    <header style={{
      background: "#0a2030", height: 64, display: "flex", alignItems: "center",
      padding: "0 24px", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200,
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <button onClick={() => dispatch({ type: AT.TOGGLE_SIDEBAR })}
          style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "block", width: 22, height: 2, background: "#fff" }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#fff" }} />
          <span style={{ display: "block", width: 22, height: 2, background: "#fff" }} />
        </button>
        <button onClick={() => dispatch({ type: AT.TOGGLE_SEARCH })}
          style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>
          🔍
        </button>
        {searchOpen && (
          <input
            autoFocus
            value={searchQuery}
            onChange={e => dispatch({ type: AT.SET_SEARCH, payload: e.target.value })}
            placeholder="Search classes..."
            style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 20, padding: "6px 14px", color: "#fff", fontSize: 14,
              outline: "none", width: 240, fontFamily: "inherit",
            }}
          />
        )}
      </div>

      {/* Center Logo */}
      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>
        Skill<span style={{ color: "#00c853" }}>Learn</span>.
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isLoggedIn ? (
          <>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#00c853", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a2030", fontWeight: 800, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{user.avatar}</div>
            <span style={{ color: "#e0e0e0", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{user.name.split(" ")[0]}</span>
            <button onClick={() => dispatch({ type: AT.LOGOUT })} style={{ background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 4, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => { dispatch({ type: AT.OPEN_MODAL, payload: "auth" }); dispatch({ type: AT.SET_AUTH_TAB, payload: "signup" }); }}
            style={{ background: "#00c853", border: "none", color: "#fff", borderRadius: 4, padding: "10px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3 }}>
            Sign Up
          </button>
        )}
      </div>
    </header>
  );
}

// Sidebar
function Sidebar() {
  const dispatch = useDispatch();
  const { activeCategory, sidebarOpen } = useSelector(s => s.nav);
  if (!sidebarOpen) return null;

  return (
    <aside style={{
      width: 230, minWidth: 230, background: "#fff", borderRight: "1px solid #e8e8e8",
      height: "calc(100vh - 64px)", overflowY: "auto", padding: "24px 0",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ padding: "0 24px", marginBottom: 16 }}>
        <span style={{ fontWeight: 800, fontSize: 15, color: "#0a2030" }}>All Classes</span>
      </div>
      {Object.entries(CATEGORIES).map(([group, items]) => (
        <div key={group} style={{ marginBottom: 16 }}>
          <div style={{ padding: "8px 24px", fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: 1.2, textTransform: "uppercase" }}>
            {group}
          </div>
          <div style={{ borderBottom: "1px solid #f0f0f0", marginBottom: 4 }} />
          {items.map(item => (
            <button key={item} onClick={() => dispatch({ type: AT.SET_CATEGORY, payload: item })}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "9px 24px",
                border: "none", background: activeCategory === item ? "#0a2030" : "none",
                color: activeCategory === item ? "#fff" : "#333",
                fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                fontWeight: activeCategory === item ? 600 : 400,
                transition: "all 0.15s",
              }}>
              {item}
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}

// Hero Banner
function HeroBanner() {
  const dispatch = useDispatch();
  const category = useSelector(s => s.nav.activeCategory);
  const { isLoggedIn } = useSelector(s => s.auth);
  const hero = HERO_BANNERS[category] || HERO_BANNERS["default"];

  return (
    <div style={{
      position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 32,
      height: 280, background: "#1a1a2e",
    }}>
      <img src={hero.bg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
      <div style={{ position: "absolute", inset: 0, background: hero.gradient }} />
      <div style={{ position: "relative", padding: "40px 40px", maxWidth: 560 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 900, color: "#fff", marginBottom: 12, lineHeight: 1.2 }}>
          {hero.title}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 1.6, marginBottom: 24, fontFamily: "'DM Sans', sans-serif" }}>
          {hero.subtitle}
        </p>
        <button
          onClick={() => { if (!isLoggedIn) { dispatch({ type: AT.OPEN_MODAL, payload: "auth" }); dispatch({ type: AT.SET_AUTH_TAB, payload: "signup" }); } }}
          style={{
            background: "#00c853", border: "none", color: "#fff",
            padding: "13px 28px", borderRadius: 6, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: 15, cursor: "pointer", letterSpacing: 0.3,
          }}>
          {isLoggedIn ? `Explore ${category}` : "Get Started for Free"}
        </button>
      </div>
    </div>
  );
}

// Skill Tags Bar
function SkillTagsBar() {
  const dispatch = useDispatch();
  const category = useSelector(s => s.nav.activeCategory);
  const activeTag = useSelector(s => s.courses.activeSkillTag);
  const tags = SKILL_TAGS[category] || [];
  if (!tags.length) return null;

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "#666", letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Related Skills
        </span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tags.map(tag => (
            <button key={tag} onClick={() => dispatch({ type: AT.SET_SKILL_TAG, payload: tag })}
              style={{
                padding: "7px 14px", borderRadius: 4,
                border: `2px solid ${activeTag === tag ? "#0a2030" : "#333"}`,
                background: activeTag === tag ? "#0a2030" : "transparent",
                color: activeTag === tag ? "#fff" : "#0a2030",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13,
                cursor: "pointer", transition: "all 0.15s",
              }}>
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Course Card
function CourseCard({ course }) {
  const dispatch = useDispatch();
  const enrolled = useSelector(s => s.courses.enrolled.includes(course.id));
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
      {/* Thumbnail */}
      <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", marginBottom: 12, aspectRatio: "16/9" }}>
        <img src={course.thumb} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s", transform: hovered ? "scale(1.04)" : "scale(1)" }} />
        {course.isOriginal && (
          <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, letterSpacing: 0.5 }}>
            Original
          </span>
        )}
        {enrolled && (
          <span style={{ position: "absolute", top: 10, right: 10, background: "#00c853", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4 }}>
            ✓ Enrolled
          </span>
        )}
        {hovered && !enrolled && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button onClick={() => dispatch(thunks.enroll(course))}
              style={{ background: "#00c853", border: "none", color: "#fff", padding: "10px 22px", borderRadius: 6, fontFamily: "inherit", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Enroll Free
            </button>
          </div>
        )}
      </div>
      {/* Info */}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0a2030", marginBottom: 4, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {course.title}
      </h3>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>{course.instructor}</p>
      <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#888" }}>
        <span>⏱ {course.duration}</span>
        <span>📚 {course.lessons} lessons</span>
        <span style={{ color: "#f59e0b" }}>★ {course.rating}</span>
      </div>
    </div>
  );
}

// Course Grid
function CourseGrid() {
  const courses = useSelector(sel.filteredCourses);
  const searchQuery = useSelector(s => s.nav.searchQuery);
  const category = useSelector(s => s.nav.activeCategory);

  if (!courses.length) return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "#999", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
      <p style={{ fontSize: 16 }}>No classes found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: "#0a2030" }}>
          {searchQuery ? `Search results` : `${category} Classes`}
        </h2>
        <span style={{ fontSize: 13, color: "#888", fontFamily: "'DM Sans', sans-serif" }}>{courses.length} classes</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 28 }}>
        {courses.map(c => <CourseCard key={c.id} course={c} />)}
      </div>
    </div>
  );
}

// Main Layout
function Main() {
  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px", background: "#fafafa" }}>
        <HeroBanner />
        <SkillTagsBar />
        <div style={{ borderTop: "1px solid #e8e8e8", marginBottom: 28 }} />
        <CourseGrid />
      </main>
    </div>
  );
}

// Root App
export default function App() {
  return (
    <StoreProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fafafa; }
        button { cursor: pointer; transition: all 0.15s; }
        button:hover { opacity: 0.9; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f0f0f0; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
      `}</style>
      <Toast />
      <AuthModal />
      <Navbar />
      <Main />
    </StoreProvider>
  );
}
