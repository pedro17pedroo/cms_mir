import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  showPresets?: boolean;
  showInput?: boolean;
  className?: string;
}

const defaultPresetColors = [
  "#000000", "#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af",
  "#6b7280", "#374151", "#1f2937", "#111827", "#ef4444", "#f97316", 
  "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#14b8a6",
  "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
  "#d946ef", "#ec4899", "#f43f5e"
];

export function ColorPicker({
  value = "#000000",
  onChange,
  presetColors = defaultPresetColors,
  showPresets = true,
  showInput = true,
  className
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleColorChange = (color: string) => {
    onChange(color);
    setInputValue(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (isValidColor(newValue)) {
      onChange(newValue);
    }
  };

  const isValidColor = (color: string) => {
    const s = new Option().style;
    s.color = color;
    return s.color !== "";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start gap-2 ${className}`}
        >
          <div
            className="w-4 h-4 rounded border border-gray-300"
            style={{ backgroundColor: value }}
          />
          <span className="flex-1 text-left">{value}</span>
          <Palette className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          {showInput && (
            <div>
              <Label htmlFor="color-input" className="text-sm font-medium">
                Cor personalizada
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="color-input"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="#000000"
                  className="flex-1 text-sm"
                />
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-10 h-10 border rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {showPresets && (
            <div>
              <Label className="text-sm font-medium">Cores predefinidas</Label>
              <div className="grid grid-cols-9 gap-1 mt-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
                      value === color ? "border-blue-500" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      handleColorChange(color);
                      setIsOpen(false);
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Label className="text-sm font-medium">Transparência</Label>
            <div className="flex gap-1 mt-2">
              {["transparent", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"].map((alpha) => (
                <button
                  key={alpha}
                  className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
                    value === alpha ? "border-blue-500" : "border-gray-300"
                  }`}
                  style={{ 
                    backgroundColor: alpha,
                    backgroundImage: alpha === "transparent" ? 
                      "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)" : 
                      undefined,
                    backgroundSize: alpha === "transparent" ? "8px 8px" : undefined,
                    backgroundPosition: alpha === "transparent" ? "0 0, 0 4px, 4px -4px, -4px 0px" : undefined
                  }}
                  onClick={() => {
                    handleColorChange(alpha);
                    setIsOpen(false);
                  }}
                  title={alpha}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}