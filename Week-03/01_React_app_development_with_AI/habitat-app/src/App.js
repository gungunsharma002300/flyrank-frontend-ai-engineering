import React, { useState, useEffect, useRef } from "react";
import { Plus, X, Flame, Sparkles, Trash2, Leaf } from "lucide-react";

const STAGE_CONFIG = [
  { label: "Seed", stemHeight: 0, leaves: [], flowers: [], glow: false },
  {
    label: "Sprout",
    stemHeight: 18,
    leaves: [
      { t: 1, side: -1, rot: -30, scale: 0.7 },
      { t: 1, side: 1, rot: 30, scale: 0.7 },
    ],
    flowers: [],
    glow: false,
  },
  {
    label: "Sapling",
    stemHeight: 34,
    leaves: [
      { t: 0.55, side: -1, rot: -40, scale: 0.8 },
      { t: 0.55, side: 1, rot: 40, scale: 0.8 },
      { t: 1, side: -1, rot: -25, scale: 0.9 },
      { t: 1, side: 1, rot: 25, scale: 0.9 },
    ],
    flowers: [],
    glow: false,
  },
  {
    label: "Young tree",
    stemHeight: 50,
    leaves: [
      { t: 0.4, side: -1, rot: -45, scale: 0.85 },
      { t: 0.4, side: 1, rot: 45, scale: 0.85 },
      { t: 0.7, side: -1, rot: -35, scale: 0.95 },
      { t: 0.7, side: 1, rot: 35, scale: 0.95 },
      { t: 1, side: -1, rot: -20, scale: 1 },
      { t: 1, side: 1, rot: 20, scale: 1 },
    ],
    flowers: [{ t: 1, side: 0, scale: 0.55, bud: true }],
    glow: false,
  },
  {
    label: "Blooming",
    stemHeight: 62,
    leaves: [
      { t: 0.3, side: -1, rot: -50, scale: 0.9 },
      { t: 0.3, side: 1, rot: 50, scale: 0.9 },
      { t: 0.55, side: -1, rot: -35, scale: 1 },
      { t: 0.55, side: 1, rot: 35, scale: 1 },
      { t: 0.8, side: -1, rot: -25, scale: 1.05 },
      { t: 0.8, side: 1, rot: 25, scale: 1.05 },
    ],
    flowers: [
      { t: 1, side: -0.4, scale: 1 },
      { t: 1, side: 0.4, scale: 0.85 },
    ],
    glow: true,
  },
  {
    label: "Flourishing",
    stemHeight: 70,
    leaves: [
      { t: 0.25, side: -1, rot: -55, scale: 1 },
      { t: 0.25, side: 1, rot: 55, scale: 1 },
      { t: 0.5, side: -1, rot: -40, scale: 1.1 },
      { t: 0.5, side: 1, rot: 40, scale: 1.1 },
      { t: 0.75, side: -1, rot: -28, scale: 1.15 },
      { t: 0.75, side: 1, rot: 28, scale: 1.15 },
      { t: 0.95, side: -1, rot: -15, scale: 1.1 },
      { t: 0.95, side: 1, rot: 15, scale: 1.1 },
    ],
    flowers: [
      { t: 1, side: -0.5, scale: 1.1 },
      { t: 1, side: 0, scale: 1.2 },
      { t: 1, side: 0.5, scale: 1.1 },
    ],
    glow: true,
  },
];

const BASE_Y = 122;
const STEM_X = 60;

function getStage(streak) {
  if (streak <= 0) return 0;
  if (streak < 3) return 1;
  if (streak < 7) return 2;
  if (streak < 14) return 3;
  if (streak < 30) return 4;
  return 5;
}

function LeafShape({ x, y, rot, scale, tone }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <path
        d="M0,0 C7,-4 7,-14 0,-19 C-7,-14 -7,-4 0,0 Z"
        fill={tone}
        opacity="0.95"
      />
      <path d="M0,-1 L0,-16" stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" />
    </g>
  );
}

function Flower({ x, y, scale, bud }) {
  if (bud) {
    return (
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <path d="M0,0 C6,-3 6,-13 0,-16 C-6,-13 -6,-3 0,0 Z" fill="#D68C7A" />
      </g>
    );
  }
  const petals = [0, 72, 144, 216, 288];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {petals.map((deg, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-7"
          rx="4.2"
          ry="6"
          fill="#E9A3A0"
          transform={`rotate(${deg})`}
          opacity="0.95"
        />
      ))}
      <circle cx="0" cy="0" r="3.4" fill="#E8B24D" />
    </g>
  );
}

function Plant({ stage, pulse }) {
  const cfg = STAGE_CONFIG[stage];
  const tipY = BASE_Y - cfg.stemHeight;
  const leafTone = stage >= 4 ? "#5FA870" : "#4E8B63";

  return (
    <g
      style={{
        transformOrigin: "60px 122px",
        transition: "transform 0.6s cubic-bezier(.34,1.56,.64,1)",
        transform: pulse ? "scale(1.08)" : "scale(1)",
      }}
    >
      {cfg.glow && (
        <ellipse
          cx={STEM_X}
          cy={tipY + 4}
          rx="34"
          ry="30"
          fill="#E8B24D"
          opacity="0.16"
          className="habitat-glow"
        />
      )}

      <ellipse cx={STEM_X} cy={126} rx="34" ry="9" fill="#3A2A1E" opacity="0.5" />
      <path
        d="M28,150 L36,118 C36,113 84,113 84,118 L92,150 Z"
        fill="#5C4230"
      />
      <path d="M28,150 L92,150 L88,158 L32,158 Z" fill="#4A3728" />
      <ellipse cx={STEM_X} cy="118" rx="26" ry="7" fill="#2E2118" />

      {cfg.stemHeight > 0 && (
        <path
          d={`M${STEM_X},${BASE_Y} Q${STEM_X + 4},${BASE_Y - cfg.stemHeight / 2} ${STEM_X},${tipY}`}
          stroke="#3E7048"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
          className="habitat-stem"
        />
      )}

      {stage === 0 && (
        <circle cx={STEM_X} cy={BASE_Y - 3} r="2.6" fill="#C9B27E" />
      )}

      {cfg.leaves.map((lf, i) => {
        const y = BASE_Y - cfg.stemHeight * lf.t;
        const x = STEM_X + lf.side * (5 + 9 * lf.t);
        return (
          <LeafShape
            key={i}
            x={x}
            y={y}
            rot={lf.rot}
            scale={lf.scale}
            tone={leafTone}
          />
        );
      })}

      {cfg.flowers.map((fl, i) => {
        const y = tipY;
        const x = STEM_X + fl.side * 15;
        return (
          <Flower key={i} x={x} y={y} scale={fl.scale} bud={fl.bud} />
        );
      })}
    </g>
  );
}

function Sparkle({ style }) {
  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        ...style,
      }}
      className="habitat-sparkle"
    >
      <Sparkles size={14} color="#E8B24D" />
    </div>
  );
}

function HistoryTrail({ history }) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ key, done: !!history[key] });
  }
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {days.map((d) => (
        <span
          key={d.key}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: d.done ? "#E8B24D" : "transparent",
            border: d.done ? "none" : "1.4px solid rgba(242,237,225,0.28)",
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

const EMOJI_OPTIONS = ["🌱", "💧", "📖", "🏃", "🧘", "✍️", "🎨", "🥗", "😴", "🎯", "✍🏻", "🎤"];

export default function App() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🌱");
  const [celebrateId, setCelebrateId] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const mounted = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = localStorage.getItem("habitat-habits-v1");
        if (saved) {
          setHabits(JSON.parse(saved));
        }
      } catch (e) {
        // no saved data yet, start fresh
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    (async () => {
      try {
        localStorage.setItem("habitat-habits-v1", JSON.stringify(habits));
      } catch (e) {
        // storage unavailable; app still works for this session
      }
    })();
  }, [habits, loading]);

  const todayStr = () => new Date().toISOString().slice(0, 10);
  const daysAgoStr = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  };

  const addHabit = () => {
    if (!newName.trim()) return;
    const habit = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: newName.trim(),
      emoji: newEmoji,
      streak: 0,
      longestStreak: 0,
      history: {},
      createdAt: Date.now(),
    };
    setHabits((prev) => [...prev, habit]);
    setNewName("");
    setNewEmoji("🌱");
    setShowAddForm(false);
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const markDone = (id) => {
    const today = todayStr();
    const yesterday = daysAgoStr(1);
    let resultStreak = null;
    let resultName = null;

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id || h.history[today]) return h;
        const newStreak = h.history[yesterday] ? h.streak + 1 : 1;
        resultStreak = newStreak;
        resultName = h.name;
        return {
          ...h,
          streak: newStreak,
          longestStreak: Math.max(h.longestStreak, newStreak),
          history: { ...h.history, [today]: true },
        };
      })
    );

    if (resultStreak !== null) {
      setCelebrateId(id);
      setTimeout(() => setCelebrateId(null), 1000);
      if ([3, 7, 14, 30, 60, 100].includes(resultStreak)) {
        setMilestone(`${resultName} hit a ${resultStreak}-day streak`);
        setTimeout(() => setMilestone(null), 3200);
      }
    }
  };

  const today = todayStr();
  const totalHabits = habits.length;
  const doneToday = habits.filter((h) => h.history[today]).length;
  const completion = totalHabits ? Math.round((doneToday / totalHabits) * 100) : 0;
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.longestStreak), 0);

  return (
    <div className="habitat-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&family=Manrope:wght@400;500;600;700;800&display=swap');

        .habitat-root {
          font-family: 'Manrope', sans-serif;
          min-height: 100vh;
          width: 100%;
          background: radial-gradient(ellipse at 30% 0%, #1E3226 0%, #142219 55%, #0F1A12 100%);
          color: #F2EDE1;
          padding: 40px 20px 64px;
          box-sizing: border-box;
        }
        .habitat-display {
          font-family: 'Fraunces', serif;
        }
        .habitat-card {
          background: #1C2E23;
          border: 1px solid rgba(242,237,225,0.08);
          border-radius: 18px;
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          animation: habitat-fade-up 0.6s ease both;
        }
        .habitat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(232,178,77,0.35);
          box-shadow: 0 16px 32px rgba(0,0,0,0.28);
        }
        .habitat-card:hover .habitat-pot-group {
          animation: habitat-sway 2.4s ease-in-out infinite;
        }
        @keyframes habitat-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes habitat-sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.4deg); }
        }
        @keyframes habitat-glow-pulse {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.26; }
        }
        .habitat-glow {
          animation: habitat-glow-pulse 2.6s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes habitat-sparkle-float {
          0% { opacity: 0; transform: translateY(0) scale(0.6); }
          20% { opacity: 1; transform: translateY(-6px) scale(1); }
          100% { opacity: 0; transform: translateY(-46px) scale(0.9); }
        }
        .habitat-sparkle {
          animation: habitat-sparkle-float 1s ease-out forwards;
        }
        @keyframes habitat-count-bounce {
          0% { transform: scale(1); }
          40% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        .habitat-count-bump {
          animation: habitat-count-bounce 0.5s cubic-bezier(.34,1.56,.64,1);
          display: inline-block;
        }
        @keyframes habitat-toast-in {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .habitat-toast {
          animation: habitat-toast-in 0.4s ease both;
        }
        .habitat-btn {
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }
        .habitat-btn:active {
          transform: scale(0.96);
        }
        .habitat-btn:focus-visible, .habitat-input:focus-visible, .habitat-emoji:focus-visible {
          outline: 2px solid #E8B24D;
          outline-offset: 2px;
        }
        .habitat-input {
          font-family: 'Manrope', sans-serif;
          background: #14231B;
          border: 1px solid rgba(242,237,225,0.15);
          border-radius: 10px;
          color: #F2EDE1;
          padding: 10px 14px;
          font-size: 14px;
        }
        .habitat-input::placeholder { color: rgba(242,237,225,0.4); }
        .habitat-emoji {
          cursor: pointer;
          border: 1.5px solid transparent;
          border-radius: 10px;
          background: rgba(242,237,225,0.05);
          font-size: 18px;
          padding: 6px 8px;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .habitat-emoji.selected {
          border-color: #E8B24D;
          background: rgba(232,178,77,0.14);
        }
        @media (prefers-reduced-motion: reduce) {
          .habitat-card, .habitat-glow, .habitat-sparkle, .habitat-count-bump,
          .habitat-pot-group, .habitat-toast, * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <header style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Leaf size={22} color="#E8B24D" />
            <h1
              className="habitat-display"
              style={{ fontSize: 34, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}
            >
              Habitat
            </h1>
          </div>
          <p style={{ color: "rgba(242,237,225,0.55)", fontSize: 15, margin: "0 0 24px" }}>
            Where habits take root.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 14,
              maxWidth: 560,
            }}
          >
            <div className="habitat-card" style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: "rgba(242,237,225,0.5)", marginBottom: 4 }}>
                Today's growth
              </div>
              <div className="habitat-display" style={{ fontSize: 24, fontWeight: 700 }}>
                {completion}%
              </div>
            </div>
            <div className="habitat-card" style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: "rgba(242,237,225,0.5)", marginBottom: 4 }}>
                Best streak
              </div>
              <div className="habitat-display" style={{ fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <Flame size={18} color="#E8B24D" />
                {bestStreak}
              </div>
            </div>
            <div className="habitat-card" style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 12, color: "rgba(242,237,225,0.5)", marginBottom: 4 }}>
                Habits growing
              </div>
              <div className="habitat-display" style={{ fontSize: 24, fontWeight: 700 }}>
                {totalHabits}
              </div>
            </div>
          </div>
        </header>

        {!showAddForm ? (
          <button
            className="habitat-btn"
            onClick={() => setShowAddForm(true)}
            style={{
              background: "#E8B24D",
              color: "#14231B",
              borderRadius: 12,
              padding: "12px 20px",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 28,
            }}
          >
            <Plus size={16} />
            Plant a new habit
          </button>
        ) : (
          <div
            className="habitat-card"
            style={{ padding: 20, marginBottom: 28, animation: "habitat-fade-up 0.35s ease both" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span className="habitat-display" style={{ fontSize: 17, fontWeight: 700 }}>
                New habit
              </span>
              <button
                className="habitat-btn"
                onClick={() => setShowAddForm(false)}
                style={{ background: "none", color: "rgba(242,237,225,0.5)" }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <input
              className="habitat-input"
              style={{ width: "100%", boxSizing: "border-box", marginBottom: 14 }}
              placeholder="Drink 8 glasses of water"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              autoFocus
            />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {EMOJI_OPTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  className={"habitat-emoji" + (newEmoji === em ? " selected" : "")}
                  onClick={() => setNewEmoji(em)}
                >
                  {em}
                </button>
              ))}
            </div>
            <button
              className="habitat-btn"
              onClick={addHabit}
              style={{
                background: "#E8B24D",
                color: "#14231B",
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 14,
              }}
            >
              Plant it
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ color: "rgba(242,237,225,0.5)", fontSize: 14 }}>
            Loading your garden...
          </div>
        ) : totalHabits === 0 ? (
          <div
            className="habitat-card"
            style={{ padding: "48px 24px", textAlign: "center" }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🪴</div>
            <div className="habitat-display" style={{ fontSize: 19, fontWeight: 700, marginBottom: 6 }}>
              Your garden is empty
            </div>
            <div style={{ color: "rgba(242,237,225,0.55)", fontSize: 14 }}>
              Plant your first habit above and watch it grow, one day at a time.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 18,
            }}
          >
            {habits.map((h, idx) => {
              const stage = getStage(h.streak);
              const doneToday = !!h.history[today];
              const pulsing = celebrateId === h.id;
              return (
                <div
                  key={h.id}
                  className="habitat-card"
                  style={{ padding: 18, position: "relative", animationDelay: `${idx * 0.06}s` }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{h.emoji}</span>
                      <span className="habitat-display" style={{ fontSize: 16, fontWeight: 600 }}>
                        {h.name}
                      </span>
                    </div>
                    <button
                      className="habitat-btn"
                      onClick={() => deleteHabit(h.id)}
                      style={{ background: "none", color: "rgba(242,237,225,0.3)" }}
                      aria-label={`Remove ${h.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ position: "relative", display: "flex", justifyContent: "center", margin: "6px 0" }}>
                    <svg viewBox="0 0 120 160" width="150" height="140" className="habitat-pot-group">
                      <Plant stage={stage} pulse={pulsing} />
                    </svg>
                    {pulsing && (
                      <>
                        <Sparkle style={{ top: "20%", left: "30%" }} />
                        <Sparkle style={{ top: "10%", left: "55%" }} />
                        <Sparkle style={{ top: "30%", left: "68%" }} />
                      </>
                    )}
                  </div>

                  <div style={{ textAlign: "center", fontSize: 12, color: "rgba(242,237,225,0.5)", marginBottom: 10 }}>
                    {STAGE_CONFIG[stage].label}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Flame size={15} color="#E8B24D" />
                      <span
                        key={h.streak}
                        className={pulsing ? "habitat-count-bump" : ""}
                        style={{ fontWeight: 700, fontSize: 14 }}
                      >
                        {h.streak}
                      </span>
                      <span style={{ fontSize: 12, color: "rgba(242,237,225,0.45)" }}>day streak</span>
                    </div>
                    <HistoryTrail history={h.history} />
                  </div>

                  <button
                    className="habitat-btn"
                    onClick={() => markDone(h.id)}
                    disabled={doneToday}
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      borderRadius: 10,
                      fontSize: 13,
                      background: doneToday ? "rgba(232,178,77,0.12)" : "#E8B24D",
                      color: doneToday ? "#E8B24D" : "#14231B",
                      opacity: doneToday ? 0.9 : 1,
                    }}
                  >
                    {doneToday ? "Watered today" : "Mark today done"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {milestone && (
        <div
          className="habitat-toast"
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            background: "#E8B24D",
            color: "#14231B",
            padding: "10px 20px",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 13,
            zIndex: 50,
            boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
          }}
        >
          {milestone}
        </div>
      )}
    </div>
  );
}
