import { useEffect, useState } from "react";

import {
  FiX,
  FiPackage,
  FiUser,
  FiTruck,
  FiMapPin,
  FiCalendar,
  FiNavigation,
} from "react-icons/fi";

const initialForm = {
  customer: "",
  pickupLocation: "",
  deliveryLocation: "",
  driverId: "",
  vehicleId: "",
  status: "Pending",
  date: "",
};

function ShipmentForm({
  initialShipment,
  onAdd,
  onUpdate,
  onCancel,
  drivers = [],
  vehicles = [],
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(initialShipment);

  /* =====================================================
     AVAILABLE DRIVERS
  ===================================================== */

  const availableDrivers = drivers.filter((driver) => {
    const unavailable =
      driver.status === "On Leave" ||
      driver.status === "Off Duty";

    const isCurrentDriver =
      initialShipment?.driverId === driver.id;

    return !unavailable || isCurrentDriver;
  });

  /* =====================================================
     AVAILABLE VEHICLES
  ===================================================== */

  const availableVehicles = vehicles.filter((vehicle) => {
    const unavailable =
      vehicle.status === "Maintenance" ||
      vehicle.status === "Inactive";

    const isCurrentVehicle =
      initialShipment?.vehicleId === vehicle.id;

    return !unavailable || isCurrentVehicle;
  });

  /* =====================================================
     LOAD EXISTING SHIPMENT
  ===================================================== */

  useEffect(() => {
    if (initialShipment) {
      const existingDriver =
        drivers.find(
          (driver) =>
            driver.id === initialShipment.driverId ||
            driver.name === initialShipment.driver
        ) || null;

      const existingVehicle =
        vehicles.find(
          (vehicle) =>
            vehicle.id === initialShipment.vehicleId ||
            vehicle.registrationNumber ===
              initialShipment.vehicle
        ) || null;

      setForm({
        customer:
          initialShipment.customer || "",

        pickupLocation:
          initialShipment.pickupLocation ||
          initialShipment.pickup ||
          "",

        deliveryLocation:
          initialShipment.deliveryLocation ||
          initialShipment.delivery ||
          "",

        driverId:
          initialShipment.driverId ||
          existingDriver?.id ||
          "",

        vehicleId:
          initialShipment.vehicleId ||
          existingVehicle?.id ||
          "",

        status:
          initialShipment.status ||
          "Pending",

        date:
          initialShipment.date || "",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [initialShipment, drivers, vehicles]);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    /*
      DRIVER SELECTED
    */

    if (name === "driverId") {
      const selectedDriver = drivers.find(
        (driver) => driver.id === value
      );

      /*
        If selected driver already has a vehicle,
        automatically assign that vehicle.
      */
      const driverVehicle = selectedDriver?.vehicleId
        ? vehicles.find(
            (vehicle) =>
              vehicle.id === selectedDriver.vehicleId
          )
        : null;

      setForm((previous) => ({
        ...previous,

        driverId: value,

        vehicleId:
          driverVehicle?.id ||
          previous.vehicleId,
      }));

      setErrors((previous) => ({
        ...previous,
        driverId: "",
        vehicleId: "",
      }));

      return;
    }

    /*
      VEHICLE SELECTED
    */

    if (name === "vehicleId") {
      const selectedVehicle = vehicles.find(
        (vehicle) => vehicle.id === value
      );

      /*
        If vehicle already has a driver,
        automatically assign that driver.
      */
      const vehicleDriver = selectedVehicle?.driverId
        ? drivers.find(
            (driver) =>
              driver.id === selectedVehicle.driverId
          )
        : null;

      setForm((previous) => ({
        ...previous,

        vehicleId: value,

        driverId:
          vehicleDriver?.id ||
          previous.driverId,
      }));

      setErrors((previous) => ({
        ...previous,
        driverId: "",
        vehicleId: "",
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

    if (!form.customer.trim()) {
      newErrors.customer =
        "Customer name is required";
    }

    if (!form.pickupLocation.trim()) {
      newErrors.pickupLocation =
        "Pickup location is required";
    }

    if (!form.deliveryLocation.trim()) {
      newErrors.deliveryLocation =
        "Delivery location is required";
    }

    if (!form.driverId) {
      newErrors.driverId =
        "Please select a driver";
    }

    if (!form.vehicleId) {
      newErrors.vehicleId =
        "Please select a vehicle";
    }

    if (!form.date) {
      newErrors.date =
        "Delivery date is required";
    }

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

    const selectedDriver = drivers.find(
      (driver) => driver.id === form.driverId
    );

    const selectedVehicle = vehicles.find(
      (vehicle) => vehicle.id === form.vehicleId
    );

    const shipmentData = {
      ...(initialShipment || {}),

      customer: form.customer.trim(),

      pickupLocation:
        form.pickupLocation.trim(),

      deliveryLocation:
        form.deliveryLocation.trim(),

      pickup:
        form.pickupLocation.trim(),

      delivery:
        form.deliveryLocation.trim(),

      driverId:
        selectedDriver?.id || null,

      driver:
        selectedDriver?.name || "Unassigned",

      vehicleId:
        selectedVehicle?.id || null,

      vehicle:
        selectedVehicle?.registrationNumber ||
        "Unassigned",

      status: form.status,

      date: form.date,
    };

    /* ===================================================
       UPDATE
    =================================================== */

    if (isEditing) {
      onUpdate(shipmentData);
      return;
    }

    /* ===================================================
       CREATE
    =================================================== */

    const newShipment = {
      ...shipmentData,

      id: `SHP-${String(Date.now()).slice(-4)}`,

      createdAt:
        new Date().toISOString(),

      timeline: [
        {
          status: "Shipment Created",
          date: new Date().toLocaleDateString(
            "en-GB"
          ),
          time: new Date().toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        },
      ],
    };

    onAdd(newShipment);

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

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiPackage size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isEditing
                  ? "Edit Shipment"
                  : "Create Shipment"}
              </h2>

              <p className="text-xs text-gray-500">
                {isEditing
                  ? "Update shipment information."
                  : "Create a new fleet shipment."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">

            {/* ================= CUSTOMER ================= */}

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Customer
              </label>

              <div className="relative">
                <FiUser
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  placeholder="e.g. Amazon India"
                  className={`${inputClass(
                    "customer"
                  )} pl-10`}
                />
              </div>

              {errors.customer && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.customer}
                </p>
              )}
            </div>

            {/* ================= PICKUP ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Pickup Location
              </label>

              <div className="relative">
                <FiMapPin
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="pickupLocation"
                  value={form.pickupLocation}
                  onChange={handleChange}
                  placeholder="e.g. Chennai"
                  className={`${inputClass(
                    "pickupLocation"
                  )} pl-10`}
                />
              </div>

              {errors.pickupLocation && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.pickupLocation}
                </p>
              )}
            </div>

            {/* ================= DELIVERY ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Delivery Location
              </label>

              <div className="relative">
                <FiNavigation
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="deliveryLocation"
                  value={form.deliveryLocation}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  className={`${inputClass(
                    "deliveryLocation"
                  )} pl-10`}
                />
              </div>

              {errors.deliveryLocation && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.deliveryLocation}
                </p>
              )}
            </div>

            {/* ================= DRIVER ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Assign Driver
              </label>

              <div className="relative">
                <FiUser
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                />

                <select
                  name="driverId"
                  value={form.driverId}
                  onChange={handleChange}
                  className={`${inputClass(
                    "driverId"
                  )} appearance-none pl-10`}
                >
                  <option value="">
                    Select Driver
                  </option>

                  {availableDrivers.map(
                    (driver) => (
                      <option
                        key={driver.id}
                        value={driver.id}
                      >
                        {driver.name} —{" "}
                        {driver.status}
                      </option>
                    )
                  )}
                </select>
              </div>

              {errors.driverId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.driverId}
                </p>
              )}
            </div>

            {/* ================= VEHICLE ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Assign Vehicle
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
                    Select Vehicle
                  </option>

                  {availableVehicles.map(
                    (vehicle) => (
                      <option
                        key={vehicle.id}
                        value={vehicle.id}
                      >
                        {vehicle.registrationNumber}{" "}
                        — {vehicle.vehicleName}
                      </option>
                    )
                  )}
                </select>
              </div>

              {errors.vehicleId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.vehicleId}
                </p>
              )}
            </div>

            {/* ================= STATUS ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Shipment Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass("status")}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="In Transit">
                  In Transit
                </option>

                <option value="Out for Delivery">
                  Out for Delivery
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Delayed">
                  Delayed
                </option>
              </select>
            </div>

            {/* ================= DATE ================= */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Delivery Date
              </label>

              <div className="relative">
                <FiCalendar
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={`${inputClass(
                    "date"
                  )} pl-10`}
                />
              </div>

              {errors.date && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.date}
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              ASSIGNMENT PREVIEW
          ================================================= */}

          {(form.driverId ||
            form.vehicleId) && (
            <div className="mx-5 mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:mx-6">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                Assignment Preview
              </p>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3">
                  <div className="flex items-center gap-2">
                    <FiUser
                      size={16}
                      className="text-blue-600"
                    />

                    <span className="text-xs text-gray-500">
                      Driver
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {drivers.find(
                      (driver) =>
                        driver.id ===
                        form.driverId
                    )?.name ||
                      "Not assigned"}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <div className="flex items-center gap-2">
                    <FiTruck
                      size={16}
                      className="text-blue-600"
                    />

                    <span className="text-xs text-gray-500">
                      Vehicle
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {vehicles.find(
                      (vehicle) =>
                        vehicle.id ===
                        form.vehicleId
                    )
                      ?.registrationNumber ||
                      "Not assigned"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onCancel}
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
                : "Create Shipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShipmentForm;