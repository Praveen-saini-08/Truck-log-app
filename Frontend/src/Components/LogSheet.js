import React, { useState } from "react";
import "./LogSheet.css";

const ROWS = [
  { key: "off_duty", label: "1. Off Duty" },
  { key: "sleeper", label: "2. Sleeper Berth" },
  { key: "driving", label: "3. Driving" },
  { key: "on_duty", label: "4. On Duty (not driving)" }
];

const ROW_Y = {
  off_duty: 42,
  sleeper: 86,
  driving: 130,
  on_duty: 174
};

const LEFT = 145;
const WIDTH = 540;
const HOUR_WIDTH = WIDTH / 24;
const RIGHT_TOTAL_X = 725;

const formatDateParts = (dateValue, dayNumber = 1) => {
  const date = dateValue ? new Date(dateValue) : new Date();
  date.setDate(date.getDate() + (dayNumber - 1));

  return {
    input: date.toISOString().split("T")[0],
    month: String(date.getMonth() + 1).padStart(2, "0"),
    day: String(date.getDate()).padStart(2, "0"),
    year: date.getFullYear()
  };
};

const buildSegments = (day) => {
  const driving = Math.min(Number(day.driving_hours || 0), 11);
  const onDuty = Number(day.on_duty_not_driving || 1);
  const drivingStart = 6 + onDuty;
  const drivingEnd = Math.min(drivingStart + driving, 24);

  return [
    { status: "off_duty", start: 0, end: 6 },
    { status: "on_duty", start: 6, end: drivingStart },
    { status: "driving", start: drivingStart, end: drivingEnd },
    { status: "off_duty", start: drivingEnd, end: 24 }
  ].filter((s) => s.end > s.start);
};

const getPolylinePoints = (segments) => {
  const points = [];

  segments.forEach((seg, index) => {
    const y = ROW_Y[seg.status];
    const x1 = LEFT + seg.start * HOUR_WIDTH;
    const x2 = LEFT + seg.end * HOUR_WIDTH;

    if (index === 0) {
      points.push(`${x1},${y}`);
    } else {
      points.push(`${x1},${ROW_Y[segments[index - 1].status]}`);
      points.push(`${x1},${y}`);
    }

    points.push(`${x2},${y}`);
  });

  return points.join(" ");
};

const LogSheet = ({ logs, inputs }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split("T")[0]);

  if (!logs || logs.length === 0) return null;

  const day = logs[selectedIndex];
  const segments = buildSegments(day);
  const date = formatDateParts(baseDate, day.day);

  const offDutyTotal = segments
    .filter((s) => s.status === "off_duty")
    .reduce((sum, s) => sum + (s.end - s.start), 0);

  const sleeperTotal = 0;
  const drivingTotal = Number(day.driving_hours || 0);
  const onDutyTotal = Number(day.on_duty_not_driving || 1);

  return (
    <div className="log-wrapper">
      <div className="log-title-row">
        <h2 className="log-main-title">Driver Daily Log Sheet</h2>

        <div className="log-controls">
          <label>
            Start Date
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
            />
          </label>

          <label>
            Log Day
            <select
              className="day-select"
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
            >
              {logs.map((log, index) => {
                const logDate = formatDateParts(baseDate, log.day);
                return (
                  <option key={index} value={index}>
                    Day {log.day} - {logDate.month}/{logDate.day}/{logDate.year}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>

      <div className="paper-log-sheet">
        <div className="paper-header">
          <div>
            <h3>Driver's Daily Log</h3>
            <p>(24 hours)</p>
          </div>

          <div className="date-line">
            <span>{date.month} / {date.day} / {date.year}</span>
            <small>month / day / year</small>
          </div>

          <div className="original-note">
            <strong>Original</strong> - File at home terminal.
            <br />
            <strong>Duplicate</strong> - Driver retains in possession for 8 days.
          </div>
        </div>

        <div className="top-fields">
          <div className="field-line">
            <strong>From:</strong> {inputs?.pickup_location || "Pickup"}
          </div>

          <div className="field-line">
            <strong>To:</strong> {inputs?.dropoff_location || "Dropoff"}
          </div>

          <div className="box-field">
            <span>{Math.round(day.miles || 0)}</span>
            <small>Total Miles Driving Today</small>
          </div>

          <div className="box-field">
            <span>TRK-{String(day.day).padStart(3, "0")}</span>
            <small>Truck/Tractor and Trailer Numbers</small>
          </div>

          <div className="long-lines">
            <div>Name of Carrier or Carriers <span>Spotter Logistics</span></div>
            <div>Main Office Address <span>Remote Operations, USA</span></div>
            <div>Home Terminal Address <span>{inputs?.current_location || "Terminal"}</span></div>
          </div>
        </div>

        <div className="graph-section">
          <svg viewBox="0 0 880 245" className="log-svg">
            <rect x="0" y="0" width="880" height="245" fill="white" />

            <rect
              x={LEFT}
              y="20"
              width={WIDTH}
              height="176"
              fill="#fff"
              stroke="#111"
              strokeWidth="1.5"
            />

            <rect x={LEFT} y="0" width={WIDTH} height="20" fill="#111" />
            <text x={LEFT + 5} y="14" fill="white" fontSize="10">Mid-night</text>
            <text x={LEFT + WIDTH / 2 - 10} y="14" fill="white" fontSize="10">Noon</text>
            <text x={LEFT + WIDTH - 52} y="14" fill="white" fontSize="10">Mid-night</text>

            {[...Array(25)].map((_, i) => {
              const x = LEFT + i * HOUR_WIDTH;
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1="20"
                    x2={x}
                    y2="196"
                    stroke="#333"
                    strokeWidth={i % 6 === 0 ? "1.4" : "0.7"}
                  />
                  {i < 24 && (
                    <text x={x + 7} y="34" fontSize="8.5" fill="#111">
                      {i === 0 ? "" : i === 12 ? "Noon" : i > 12 ? i - 12 : i}
                    </text>
                  )}
                </g>
              );
            })}

            {[1, 2, 3].map((r) => (
              <line
                key={r}
                x1={LEFT}
                y1={20 + r * 44}
                x2={LEFT + WIDTH}
                y2={20 + r * 44}
                stroke="#111"
                strokeWidth="1"
              />
            ))}

            {[...Array(96)].map((_, i) => {
              const x = LEFT + i * (HOUR_WIDTH / 4);
              const tall = i % 4 === 0;

              return (
                <g key={i}>
                  {[0, 1, 2, 3].map((row) => (
                    <line
                      key={row}
                      x1={x}
                      y1={20 + row * 44 + 25}
                      x2={x}
                      y2={20 + row * 44 + (tall ? 43 : 35)}
                      stroke="#111"
                      strokeWidth={tall ? "1.1" : "0.7"}
                    />
                  ))}
                </g>
              );
            })}

            {ROWS.map((row, i) => (
              <text
                key={row.key}
                x="8"
                y={48 + i * 44}
                fontSize="11"
                fontWeight="700"
              >
                {row.label}
              </text>
            ))}

            <polyline
              points={getPolylinePoints(segments)}
              fill="none"
              stroke="#000"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="square"
            />

            {segments.slice(1).map((seg, i) => {
              const x = LEFT + seg.start * HOUR_WIDTH;
              return (
                <circle key={i} cx={x} cy={ROW_Y[seg.status]} r="4" fill="#e11d48" />
              );
            })}

            <text x={RIGHT_TOTAL_X} y="16" fontSize="10" fontWeight="700">Total</text>
            <text x={RIGHT_TOTAL_X} y="29" fontSize="10" fontWeight="700">Hours</text>

            {[offDutyTotal, sleeperTotal, drivingTotal, onDutyTotal].map((value, i) => (
              <g key={i}>
                <line
                  x1={RIGHT_TOTAL_X}
                  y1={42 + i * 44}
                  x2={RIGHT_TOTAL_X + 75}
                  y2={42 + i * 44}
                  stroke="#111"
                />
                <text
                  x={RIGHT_TOTAL_X + 32}
                  y={36 + i * 44}
                  fontSize="12"
                  fontWeight="700"
                >
                  {Number(value).toFixed(value % 1 ? 1 : 0)}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="remarks-section">
          <strong>Remarks</strong>
          <div className="remarks-box">
            <p>Started duty. Trip day {day.day} generated from route plan.</p>
            {day.fuel_stop && <p>Fuel stop planned along the route.</p>}
            <p>
              Driving time: {day.driving_hours} hrs. Off duty/rest:{" "}
              {offDutyTotal.toFixed(1)} hrs.
            </p>
          </div>
        </div>

        <div className="shipping-section">
          <div>
            <strong>Shipping Documents:</strong>
            <div className="line"></div>
          </div>
          <div>
            <strong>Shipper & Commodity:</strong>
            <div className="line"></div>
          </div>
        </div>

        <div className="recap-section">
          <div><strong>Recap:</strong> Complete at end of day</div>
          <div><strong>On duty hours today:</strong> {(drivingTotal + onDutyTotal).toFixed(1)}</div>
          <div><strong>Total hours:</strong> {(offDutyTotal + sleeperTotal + drivingTotal + onDutyTotal).toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};

export default LogSheet;