"use client";

import { useField, TextInput } from "@payloadcms/ui";

const ColorPicker = ({
  field: { label, required = false },
  path,
}: {
  field: { label: string; required?: boolean };
  path: string;
}) => {
  const { value, setValue } = useField<string>({ path });

  return (
    <div className={"color-picker"}>
      <label className={"field-label"}>
        {label} {required && <span className="required">*</span>}
      </label>
      <div className={"color-picker-row"}>
        <input
          type="color"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <TextInput
          label=""
          path={path}
          onChange={(e: { target: { value: string } }) =>
            setValue(e.target.value)
          }
          value={value}
        />
      </div>
      <style jsx>{`
        .color-picker .color-picker-row {
          margin-top: 8px;
          margin-bottom: 8px;
          display: flex;
          gap: 16px;
        }
        .color-picker .color-picker-row .field-type {
          width: 100%;
        }
        .color-picker .color-picker-row input[type='color'] {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
        }
        .color-picker .color-picker-row input[type='text'] {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default ColorPicker;
