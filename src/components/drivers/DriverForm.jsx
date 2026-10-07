import { useEffect, useState } from "react";

import {
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiCreditCard,
  FiCalendar,
  FiMapPin,
  FiTruck,
} from "react-icons/fi";

import { useApp } from "../../context/AppContext";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  licenseNumber: "",
  licenseExpiry: "",
  experience: "",
  vehicleId: "",
  assignedVehicle: "",
  vehicleName: "",
  status: "Available",
  location: "",
};

function DriverForm({
  onClose,
  onAdd,
  onUpdate,
  editingDriver,
}) {
  const { vehicleList } = useApp();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editingDriver);

  /* =====================================================
     AVAILABLE VEHICLES
  ===================================================== */

  const availableVehicles = vehicleList.filter((vehicle) => {
    const isUnavailable =
      vehicle.status === "Maintenance" ||
      vehicle.status === "Inactive";

    /*
      While editing, keep the driver's current vehicle
      visible even if its status is not normally selectable.
    */
    const isCurrentVehicle =
      editingDriver?.vehicleId === vehicle.id ||
      editingDriver?.assignedVehicle ===
        vehicle.registrationNumber ||
      editingDriver?.vehicle ===
        vehicle.registrationNumber;

    return !isUnavailable || isCurrentVehicle;
  });

  /* =====================================================
     LOAD EDIT DATA
  ===================================================== */

  useEffect(() => {
    if (editingDriver) {
      const existingVehicle =
        vehicleList.find(
          (vehicle) =>
            vehicle.id === editingDriver.vehicleId ||
            vehicle.registrationNumber ===
              editingDriver.assignedVehicle ||
            vehicle.registrationNumber ===
              editingDriver.vehicle
        ) || null;

      setForm({
        name: editingDriver.name || "",
        phone: editingDriver.phone || "",
        email: editingDriver.email || "",
        licenseNumber:
          editingDriver.licenseNumber || "",
        licenseExpiry:
          editingDriver.licenseExpiry || "",
        experience:
          editingDriver.experience || "",

        vehicleId:
          editingDriver.vehicleId ||
          existingVehicle?.id ||
          "",

        assignedVehicle:
          editingDriver.assignedVehicle ||
          editingDriver.vehicle ||
          existingVehicle?.registrationNumber ||
          "",

        vehicleName:
          editingDriver.vehicleName ||
          existingVehicle?.vehicleName ||
          "",

        status:
          editingDriver.status || "Available",

        location:
          editingDriver.location || "",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [editingDriver, vehicleList]);

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    /*
      Vehicle selection
    */
    if (name === "vehicleId") {
      if (!value) {
        setForm((previous) => ({
          ...previous,
          vehicleId: "",
          assignedVehicle: "",
          vehicleName: "",
        }));
      } else {
        const selectedVehicle = vehicleList.find(
          (vehicle) => vehicle.id === value
        );

        setForm((previous) => ({
          ...previous,
          vehicleId: selectedVehicle?.id || "",
          assignedVehicle:
            selectedVehicle?.registrationNumber || "",
          vehicleName:
            selectedVehicle?.vehicleName || "",
        }));
      }

      setErrors((previous) => ({
        ...previous,
        vehicleId: "",
        assignedVehicle: "",
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Driver name is required";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      form.phone.replace(/\D/g, "").length < 10
    ) {
      newErrors.phone =
        "Enter a valid phone number";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        "Enter a valid email";
    }

    if (!form.licenseNumber.trim()) {
      newErrors.licenseNumber =
        "License number is required";
    }

    if (!form.licenseExpiry) {
      newErrors.licenseExpiry =
        "License expiry date is required";
    }

    if (!form.experience.trim()) {
      newErrors.experience =
        "Experience is required";
    }

    if (!form.location.trim()) {
      newErrors.location =
        "Location is required";
    }

    /*
      Vehicle is optional now.
      Driver can exist without a vehicle.
    */

    return newErrors;
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    /*
      EDIT DRIVER
    */

    if (isEditing) {
      const updatedDriver = {
        ...editingDriver,

        name: form.name.trim(),

        phone: form.phone.trim(),

        email: form.email.trim(),

        licenseNumber:
          form.licenseNumber.trim(),

        licenseExpiry:
          form.licenseExpiry,

        experience:
          form.experience.trim(),

        vehicleId:
          form.vehicleId || null,

        assignedVehicle:
          form.assignedVehicle ||
          "Unassigned",

        vehicle:
          form.assignedVehicle ||
          "Unassigned",

        vehicleName:
          form.vehicleName ||
          "Unassigned",

        status:
          form.status,

        location:
          form.location.trim(),
      };

      onUpdate(updatedDriver);

      return;
    }

    /*
      ADD DRIVER
    */

    const newDriver = {
      id: `DR-${String(Date.now()).slice(-3)}`,

      name: form.name.trim(),

      phone: form.phone.trim(),

      email: form.email.trim(),

      licenseNumber:
        form.licenseNumber.trim(),

      licenseExpiry:
        form.licenseExpiry,

      experience:
        form.experience.trim(),

      vehicleId:
        form.vehicleId || null,

      assignedVehicle:
        form.assignedVehicle ||
        "Unassigned",

      vehicle:
        form.assignedVehicle ||
        "Unassigned",

      vehicleName:
        form.vehicleName ||
        "Unassigned",

      status:
        form.status,

      deliveries: 0,

      completedDeliveries: 0,

      rating: 0,

      location:
        form.location.trim(),

      joinedDate:
        new Date().toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ),
    };

    onAdd(newDriver);

    setForm(initialForm);
    setErrors({});
  };

  /* =====================================================
     INPUT CLASS
  ===================================================== */

  const inputClass = (field) =>
    `mt-1 w-full rounded-xl border bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none transition ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-blue-400 focus:bg-white"
    }`;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiUser size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isEditing
                  ? "Edit Driver"
                  : "Add Driver"}
              </h2>

              <p className="text-xs text-gray-500">
                {isEditing
                  ? "Update driver information."
                  : "Add a new driver to your fleet."}
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

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

            {/* ================= NAME ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Driver Name
              </label>

              <div className="relative">
                <FiUser
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Arun Kumar"
                  className={`${inputClass(
                    "name"
                  )} pl-10`}
                />
              </div>

              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* ================= PHONE ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <div className="relative">
                <FiPhone
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`${inputClass(
                    "phone"
                  )} pl-10`}
                />
              </div>

              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* ================= EMAIL ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>

              <div className="relative">
                <FiMail
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="driver@example.com"
                  className={`${inputClass(
                    "email"
                  )} pl-10`}
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* ================= LICENSE ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                License Number
              </label>

              <div className="relative">
                <FiCreditCard
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="licenseNumber"
                  value={form.licenseNumber}
                  onChange={handleChange}
                  placeholder="TN01 20240012345"
                  className={`${inputClass(
                    "licenseNumber"
                  )} pl-10`}
                />
              </div>

              {errors.licenseNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.licenseNumber}
                </p>
              )}
            </div>

            {/* ================= LICENSE EXPIRY ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                License Expiry
              </label>

              <div className="relative">
                <FiCalendar
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="date"
                  name="licenseExpiry"
                  value={form.licenseExpiry}
                  onChange={handleChange}
                  className={`${inputClass(
                    "licenseExpiry"
                  )} pl-10`}
                />
              </div>

              {errors.licenseExpiry && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.licenseExpiry}
                </p>
              )}
            </div>

            {/* ================= EXPERIENCE ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Experience
              </label>

              <input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="e.g. 5 years"
                className={inputClass(
                  "experience"
                )}
              />

              {errors.experience && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.experience}
                </p>
              )}
            </div>

            {/* =================================================
                ASSIGNED VEHICLE
            ================================================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Assigned Vehicle
              </label>

              <div className="relative">
                <FiTruck
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                />

                <select
                  name="vehicleId"
                  value={form.vehicleId}
                  onChange={handleChange}
                  className={`${inputClass(
                    "vehicleId"
                  )} appearance-none pl-10`}
                >
                  <option value="">
                    Unassigned
                  </option>

                  {availableVehicles.map(
                    (vehicle) => (
                      <option
                        key={vehicle.id}
                        value={vehicle.id}
                      >
                        {vehicle.registrationNumber} —{" "}
                        {vehicle.vehicleName}
                        {vehicle.status ===
                        "Maintenance"
                          ? " (Maintenance)"
                          : ""}
                        {vehicle.status ===
                        "Inactive"
                          ? " (Inactive)"
                          : ""}
                      </option>
                    )
                  )}
                </select>
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Maintenance and inactive vehicles
                cannot normally be assigned.
              </p>

              {errors.vehicleId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.vehicleId}
                </p>
              )}
            </div>

            {/* ================= VEHICLE NAME ================= */}

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
                  value={
                    form.vehicleName ||
                    "Unassigned"
                  }
                  readOnly
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 pl-10 text-sm text-gray-500 outline-none"
                />
              </div>
            </div>

            {/* ================= STATUS ================= */}

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
                <option value="Available">
                  Available
                </option>

                <option value="On Duty">
                  On Duty
                </option>

                <option value="On Leave">
                  On Leave
                </option>

                <option value="Off Duty">
                  Off Duty
                </option>
              </select>
            </div>

            {/* ================= LOCATION ================= */}

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
          </div>

          {/* ================= FOOTER ================= */}

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
                : "Add Driver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DriverForm;