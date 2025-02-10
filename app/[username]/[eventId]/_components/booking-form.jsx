"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBooking } from "@/actions/bookings";
import "react-day-picker/style.css";

export default function BookingForm({ event, availability }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      console.error("Date or time not selected");
      return;
    }

    setLoading(true);

    const startTime = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
    );
    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const bookingData = {
      eventId: event.id,
      name,
      email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      additionalInfo,
    };
    console.log("bookingData", bookingData);

    try {
      const response = await createBooking(bookingData);
      setBookingSuccess(response);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const availableDays = availability.map((day) => new Date(day.date));

  const timeSlots = selectedDate
    ? availability.find(
      (day) => day.date === format(selectedDate, "yyyy-MM-dd")
    )?.slots || []
    : [];

  if (bookingSuccess) {
    return (
      <div className="text-center p-10 border bg-white">
        <h2 className="text-2xl font-bold mb-4">Booking successful!</h2>
        {bookingSuccess.meetLink && (
          <p>
            Join the meeting:{" "}
            <a
              href={bookingSuccess.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {bookingSuccess.meetLink}
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-10 border bg-white">
      <div className="md:h-96 flex flex-col md:flex-row gap-5">
        <div className="w-full">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null); // Reset selected time when date changes
            }}
            disabled={[{ before: new Date() }]}
            modifiers={{ available: availableDays }}
            modifiersStyles={{
              available: {
                background: "lightblue",
                borderRadius: 100,
              },
            }}
          />
        </div>
        <div className="w-full h-full md:overflow-scroll no-scrollbar">
          {selectedDate && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Available Time Slots
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "default" : "outline"}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedTime && (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
          <div>
            <Input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
            />
          </div>
          <div>
            <Textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Additional Information"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Scheduling..." : "Schedule Event"}
          </Button>
        </form>
      )}
    </div>
  );
}
