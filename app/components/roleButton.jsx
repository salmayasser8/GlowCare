import React from "react";

export const RoleButton = ({ value, label, Icon, form, setForm }) => {
  const isActive = form.role === value;

  return (
    <button
      type="button"
      onClick={() => setForm({ ...form, role: value })}
      className="role-btn fw-bold w-50 p-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
      style={{
        border: isActive ? "none" : "2px solid var(--primary)",
        background: isActive ? "var(--bg-btn)" : "transparent",
        color: isActive ? "var(--bg-card)" : "var(--primary)",
      }}
    >
      <Icon />
      {label}
    </button>
  );
};
