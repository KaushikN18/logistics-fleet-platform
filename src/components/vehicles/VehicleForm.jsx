import { useEffect, useState } from "react";

import {
  FiX,
  FiTruck,
  FiUser,
  FiMapPin,
  FiDroplet,
  FiCalendar,
} from "react-icons/fi";

const initialForm = {
  vehicleName: "",
  registrationNumber: "",
  type: "",
  model: "",
  year: "",
  driver: "",
  driverId: "",
  status: "Active",
  fuelLevel: "",
  location: "",
  nextMaintenance: "",
};

function VehicleForm({
  onClose,
  onAdd,
  onUpdate,
  editingVehicle,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editingVehicle);

  useEffect(() => {
    if (editingVehicle) {
      setForm({
        vehicleName: editingVehicle.vehicleName || "",
        registrationNumber:
          editingVehicle.registrationNumber || "",
        type: editingVehicle.type || "",
        model: editingVehicle.model || "",
        year: editingVehicle.year || "",
        driver: editingVehicle.driver || "",
        driverId: editingVehicle.driverId || "",
        status: editingVehicle.status || "Active",
        fuelLevel:
          editingVehicle.fuelLevel !== undefined
            ? editingVehicle.fuelLevel
            : "",
        location: editingVehicle.location || "",
        nextMaintenance:
          editingVehicle.nextMaintenance || "",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [editingVehicle]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.vehicleName.trim()) {
      newErrors.vehicleName = "Vehicle name is required";
    }

    if (!form.registrationNumber.trim()) {
      newErrors.registrationNumber =
        "Registration number is required";
    }

    if (!form.type) {
      newErrors.type = "Vehicle type is required";
    }

    if (!form.model.trim()) {
      newErrors.model = "Model is required";
    }

    if (!form.year) {
      newErrors.year = "Year is required";
    } else if (
      Number(form.year) < 2000 ||
      Number(form.year) > 2030
    ) {
      newErrors.year = "Enter a valid year";
    }

    if (!form.driver.trim()) {
      newErrors.driver = "Driver name is required";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (form.fuelLevel === "") {
      newErrors.fuelLevel = "Fuel level is required";
    } else if (
      Number(form.fuelLevel) < 0 ||
      Number(form.fuelLevel) > 100
    ) {
      newErrors.fuelLevel =
        "Fuel level must be between 0 and 100";
    }

    if (!form.nextMaintenance) {
      newErrors.nextMaintenance =
        "Maintenance date is required";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isEditing) {
      const updatedVehicle = {
        ...editingVehicle,
        registrationNumber:
          form.registrationNumber.toUpperCase(),
        vehicleName: form.vehicleName,
        type: form.type,
        model: form.model,
        year: Number(form.year),
        driver: form.driver,
        driverId:
          form.driverId || editingVehicle.driverId,
        status: form.status,
        fuelLevel: Number(form.fuelLevel),
        location: form.location,
        nextMaintenance: form.nextMaintenance,
      };

      onUpdate(updatedVehicle);
    } else {
      const newVehicle = {
        id: `VH-${String(Date.now()).slice(-3)}`,
        registrationNumber:
          form.registrationNumber.toUpperCase(),
        vehicleName: form.vehicleName,
        type: form.type,
        model: form.model,
        year: Number(form.year),
        driver: form.driver,
        driverId:
          form.driverId ||
          `DR-${String(Date.now()).slice(-3)}`,
        status: form.status,
        fuelLevel: Number(form.fuelLevel),
        mileage: "0 km",
        lastMaintenance: "Not available",
        nextMaintenance: form.nextMaintenance,
        location: form.location,
      };

      onAdd(newVehicle);
    }

    setForm(initialForm);
    setErrors({});
  };

  const inputClass = (field) =>
    `mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-blue-400 focus:bg-white"
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiTruck size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isEditing
                  ? "Edit Vehicle"
                  : "Add Vehicle"}
              </h2>

              <p className="text-xs text-gray-500">
                {isEditing
                  ? "Update vehicle information."
                  : "Add a new vehicle to your fleet."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
            {/* Vehicle Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Vehicle Name
              </label>

              <div className="relative">
                <FiTruck
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="vehicleName"
                  value={form.vehicleName}
                  onChange={handleChange}
                  placeholder="e.g. Tata Prima"
                  className={`${inputClass(
                    "vehicleName"
                  )} pl-10`}
                />
              </div>

              {errors.vehicleName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.vehicleName}
                </p>
              )}
            </div>

            {/* Registration */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Registration Number
              </label>

              <input
                name="registrationNumber"
                value={form.registrationNumber}
                onChange={handleChange}
                placeholder="e.g. TN-38-A-4582"
                className={inputClass(
                  "registrationNumber"
                )}
              />

              {errors.registrationNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.registrationNumber}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Vehicle Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputClass("type")}
              >
                <option value="">
                  Select vehicle type
                </option>

                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Mini Truck">
                  Mini Truck
                </option>
                <option value="Container">
                  Container
                </option>
              </select>

              {errors.type && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.type}
                </p>
              )}
            </div>

            {/* Model */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Model
              </label>

              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="e.g. Prima 5530"
                className={inputClass("model")}
              />

              {errors.model && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.model}
                </p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Manufacturing Year
              </label>

              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="2026"
                min="2000"
                max="2030"
                className={inputClass("year")}
              />

              {errors.year && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.year}
                </p>
              )}
            </div>

            {/* Driver */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Assigned Driver
              </label>

              <div className="relative">
                <FiUser
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="driver"
                  value={form.driver}
                  onChange={handleChange}
                  placeholder="Driver name"
                  className={`${inputClass(
                    "driver"
                  )} pl-10`}
                />
              </div>

              {errors.driver && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.driver}
                </p>
              )}
            </div>

            {/* Driver ID */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Driver ID
              </label>

              <input
                name="driverId"
                value={form.driverId}
                onChange={handleChange}
                placeholder="e.g. DR-010"
                className={inputClass("driverId")}
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass("status")}
              >
                <option value="Active">Active</option>
                <option value="In Transit">
                  In Transit
                </option>
                <option value="Maintenance">
                  Maintenance
                </option>
                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

            {/* Fuel */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Fuel Level (%)
              </label>

              <div className="relative">
                <FiDroplet
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  name="fuelLevel"
                  value={form.fuelLevel}
                  onChange={handleChange}
                  placeholder="0 - 100"
                  min="0"
                  max="100"
                  className={`${inputClass(
                    "fuelLevel"
                  )} pl-10`}
                />
              </div>

              {errors.fuelLevel && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.fuelLevel}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Current Location
              </label>

              <div className="relative">
                <FiMapPin
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Chennai"
                  className={`${inputClass(
                    "location"
                  )} pl-10`}
                />
              </div>

              {errors.location && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.location}
                </p>
              )}
            </div>

            {/* Maintenance */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Next Maintenance
              </label>

              <div className="relative">
                <FiCalendar
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="date"
                  name="nextMaintenance"
                  value={form.nextMaintenance}
                  onChange={handleChange}
                  className={`${inputClass(
                    "nextMaintenance"
                  )} pl-10`}
                />
              </div>

              {errors.nextMaintenance && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.nextMaintenance}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              {isEditing
                ? "Save Changes"
                : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleForm;