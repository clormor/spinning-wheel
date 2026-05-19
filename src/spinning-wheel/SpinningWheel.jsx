import React, { useRef, useState } from "react";
import "./SpinningWheel.css";

const DEFAULT_SEGMENTS = [
    { label: "History", color: "#b17a4c" },
    { label: "Science & Technology", color: "#f5f797" },
    { label: "Geography", color: "#baf797" },
    { label: "Literature", color: "#f38ae2" },
    { label: "General Knowledge", color: "#97ecf7" },
    { label: "Food & Drink", color: "#715bec" },
    { label: "Sport", color: "#ee7a7a" },
    { label: "Film & TV", color: "#a578e0" },
];

const MIN_SEGMENTS = 2;
const MAX_SEGMENTS = 16;
const SPIN_DURATION_MS = 5000;
const LABEL_RADIUS_PX = 150;

function hslToHex(h, s, l) {
    const sn = s / 100;
    const ln = l / 100;
    const a = sn * Math.min(ln, 1 - ln);
    const channel = (n) => {
        const k = (n + h / 30) % 12;
        const v = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * v)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${channel(0)}${channel(8)}${channel(4)}`;
}

function defaultColor(index) {
    if (index < DEFAULT_SEGMENTS.length) return DEFAULT_SEGMENTS[index].color;
    const hue = (index * 137.508) % 360;
    return hslToHex(hue, 70, 65);
}

function defaultLabel(index) {
    if (index < DEFAULT_SEGMENTS.length) return DEFAULT_SEGMENTS[index].label;
    return `Segment ${index + 1}`;
}

function wedgeClipPath(alpha, beta) {
    const corners = [
        { angle: 45, pos: "100% 0%" },
        { angle: 135, pos: "100% 100%" },
        { angle: 225, pos: "0% 100%" },
        { angle: 315, pos: "0% 0%" },
    ];
    const boundary = (deg) => {
        const r = (deg * Math.PI) / 180;
        const sx = Math.sin(r);
        const sy = -Math.cos(r);
        const m = Math.max(Math.abs(sx), Math.abs(sy));
        return [50 + (50 * sx) / m, 50 + (50 * sy) / m];
    };
    const parts = ["50% 50%"];
    const [ax, ay] = boundary(alpha);
    parts.push(`${ax.toFixed(3)}% ${ay.toFixed(3)}%`);
    corners.forEach((c) => {
        if (c.angle > alpha && c.angle < beta) parts.push(c.pos);
    });
    const [bx, by] = boundary(beta);
    parts.push(`${bx.toFixed(3)}% ${by.toFixed(3)}%`);
    return `polygon(${parts.join(", ")})`;
}

export default function SpinningWheel() {
    const [segments, setSegments] = useState(() =>
        DEFAULT_SEGMENTS.map((s) => ({ ...s }))
    );
    const [rotation, setRotation] = useState(0);
    const [winnerIndex, setWinnerIndex] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [animateArrow, setAnimateArrow] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const timeoutsRef = useRef([]);

    const N = segments.length;
    const step = 360 / N;

    function clearPendingTimeouts() {
        timeoutsRef.current.forEach((t) => clearTimeout(t));
        timeoutsRef.current = [];
    }

    function performSpin() {
        const min = 1024;
        const max = 9999;
        const extra = Math.floor(Math.random() * (max - min)) + min;
        const newRotation = rotation + extra;
        const spinStep = step;

        clearPendingTimeouts();
        setWinnerIndex(null);
        setAnimateArrow(false);
        setRotation(newRotation);
        setSpinning(true);

        timeoutsRef.current.push(
            setTimeout(() => {
                const effective = (((90 - newRotation) % 360) + 360) % 360;
                const winner = Math.floor(effective / spinStep);
                setWinnerIndex(winner);
                setAnimateArrow(true);
            }, SPIN_DURATION_MS)
        );

        timeoutsRef.current.push(
            setTimeout(() => {
                setWinnerIndex(null);
                setAnimateArrow(false);
                setSpinning(false);
            }, SPIN_DURATION_MS * 3)
        );
    }

    function updateCount(rawValue) {
        if (!Number.isFinite(rawValue)) return;
        const next = Math.max(
            MIN_SEGMENTS,
            Math.min(MAX_SEGMENTS, Math.floor(rawValue))
        );
        setWinnerIndex(null);
        setSegments((prev) => {
            if (next === prev.length) return prev;
            if (next < prev.length) return prev.slice(0, next);
            const grown = prev.slice();
            for (let i = prev.length; i < next; i++) {
                grown.push({ label: defaultLabel(i), color: defaultColor(i) });
            }
            return grown;
        });
    }

    function updateSegment(i, patch) {
        setSegments((prev) =>
            prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
        );
    }

    function resetToDefaults() {
        setWinnerIndex(null);
        setSegments(DEFAULT_SEGMENTS.map((s) => ({ ...s })));
    }

    return (
        <div className="wheel-container">
            <div
                id="mainbox"
                className={`mainbox${animateArrow ? " animate" : ""}`}
            >
                <div
                    id="wheel"
                    className="wheel"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    <div className="wheel-segments">
                        {segments.map((seg, i) => {
                            const alpha = i * step;
                            const beta = (i + 1) * step;
                            const selected = winnerIndex === i;
                            const dimmed =
                                winnerIndex !== null && winnerIndex !== i;
                            const cls =
                                "segment" +
                                (selected ? " selected" : "") +
                                (dimmed ? " unselected" : "");
                            return (
                                <div
                                    key={i}
                                    className={cls}
                                    style={{
                                        clipPath: wedgeClipPath(alpha, beta),
                                        backgroundColor: seg.color,
                                    }}
                                />
                            );
                        })}
                    </div>
                    <div className="wheel-labels">
                        {segments.map((seg, i) => {
                            const center = i * step + step / 2;
                            const selected = winnerIndex === i;
                            return (
                                <div
                                    key={i}
                                    className={
                                        "segment-label" +
                                        (selected ? " selected" : "")
                                    }
                                    style={{
                                        transform: `translate(-50%, -50%) rotate(${center}deg) translateY(-${LABEL_RADIUS_PX}px) rotate(${-center}deg)`,
                                    }}
                                >
                                    <b>{seg.label}</b>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <button id="spinner" className="spin" onClick={performSpin}>
                    SPIN
                </button>
            </div>
            <SettingsPanel
                open={settingsOpen}
                onToggle={() => setSettingsOpen((o) => !o)}
                segments={segments}
                onCountChange={updateCount}
                onSegmentChange={updateSegment}
                onReset={resetToDefaults}
                disabled={spinning}
            />
        </div>
    );
}

function SettingsPanel({
    open,
    onToggle,
    segments,
    onCountChange,
    onSegmentChange,
    onReset,
    disabled,
}) {
    return (
        <div className={`settings${open ? " open" : ""}`}>
            <button
                type="button"
                className="settings-toggle"
                onClick={onToggle}
                aria-expanded={open}
            >
                <span className="settings-arrow">{open ? "▾" : "▸"}</span>{" "}
                Settings
            </button>
            {open && (
                <div className="settings-body">
                    <label className="settings-row">
                        <span>Number of sections</span>
                        <input
                            type="number"
                            min={MIN_SEGMENTS}
                            max={MAX_SEGMENTS}
                            value={segments.length}
                            disabled={disabled}
                            onChange={(e) => {
                                const v = parseInt(e.target.value, 10);
                                if (!Number.isNaN(v)) onCountChange(v);
                            }}
                        />
                    </label>
                    <div className="settings-segments">
                        {segments.map((seg, i) => (
                            <div key={i} className="settings-segment">
                                <span className="settings-segment-index">
                                    {i + 1}.
                                </span>
                                <input
                                    type="text"
                                    className="settings-segment-label"
                                    value={seg.label}
                                    disabled={disabled}
                                    onChange={(e) =>
                                        onSegmentChange(i, {
                                            label: e.target.value,
                                        })
                                    }
                                />
                                <input
                                    type="color"
                                    className="settings-segment-color"
                                    value={seg.color}
                                    disabled={disabled}
                                    onChange={(e) =>
                                        onSegmentChange(i, {
                                            color: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="settings-reset"
                        onClick={onReset}
                        disabled={disabled}
                    >
                        Reset to defaults
                    </button>
                </div>
            )}
        </div>
    );
}
