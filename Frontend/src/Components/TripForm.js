import React, { useState } from "react";
import axios from "axios";

function TripForm({ setTripData }) {
  const [formData, setFormData] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    cycle_used: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (
      !formData.current_location ||
      !formData.pickup_location ||
      !formData.dropoff_location ||
      formData.cycle_used === ""
    ) {
      return "All fields are required.";
    }

    if (Number(formData.cycle_used) > 70) {
      return "Cycle hours cannot exceed 70.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/plan-trip/",
        {
          ...formData,
          cycle_used: Number(formData.cycle_used)
        }
      );

      setTripData(response.data);
    } catch (err) {
      setError("Unable to generate trip plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <input
        name="current_location"
        placeholder="Current location"
        onChange={handleChange}
      />

      <input
        name="pickup_location"
        placeholder="Pickup location"
        onChange={handleChange}
      />

      <input
        name="dropoff_location"
        placeholder="Dropoff location"
        onChange={handleChange}
      />

      <input
        name="cycle_used"
        type="number"
        placeholder="Cycle hours used"
        onChange={handleChange}
      />

      {error && <p className="error-text">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Trip Plan"}
      </button>
    </form>
  );
}

export default TripForm;