"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"; // Added toast hook
import { timeSlots } from "../data";
import { updateAvailability } from "@/actions/availability";

export default function AvailabilityForm({ initialData }) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Initialize toast notifications
  //console.log("initialData", initialData);


  const handleCheckboxChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable,
        ...(prev[day].isAvailable ? { startTime: "09:00", endTime: "17:00" } : {}),
      },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    //console.log("formData", formData);


    // Validation: Check if all available days have valid time slots
    const isValid = Object.entries(formData).every(([day, data]) => {
      if (data.isAvailable) {
        return data.startTime && data.endTime;
      }
      return true;
    });

    if (!isValid) {
      toast({
        title: "Error",
        description: "Please select valid time slots for available days.",
      });
      setLoading(false);
      return;
    }

    try {
      //console.log("abhi yhi hu");

      await updateAvailability(formData); // Call API function
      //console.log("yha tk phoch gye");


      toast({
        title: "Success",
        description: "Availability updated successfully.",
      });

      // Reset form state (Optional)
      setFormData(initialData);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating availability.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
        (day) => (
          <div key={day} className="flex items-center space-x-4 mb-4">
            <Checkbox
              checked={formData[day]?.isAvailable || false}
              onCheckedChange={() => handleCheckboxChange(day)}
            />
            <span className="w-24">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
            {formData[day]?.isAvailable && (
              <>
                <Select
                  onValueChange={(value) => handleTimeChange(day, "startTime", value)}
                  value={formData[day]?.startTime}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Start Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>to</span>
                <Select
                  onValueChange={(value) => handleTimeChange(day, "endTime", value)}
                  value={formData[day]?.endTime}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="End Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        )
      )}

      {/* <div className="flex items-center space-x-4">
        <span className="w-48">Minimum gap before booking (minutes):</span>
        <Input
          type="number"
          name="timeGap"
          value={formData.timeGap || ""}
          onChange={handleInputChange}
          className="w-32"
        />
      </div> */}

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Availability"}
      </Button>
    </form>
  );
}
