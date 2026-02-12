import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";

type CollectionRequestInsert =
  Database["public"]["Tables"]["collection_requests"]["Insert"];

interface SolutionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string | null;
}

type FormData = {
  apartment_name?: string;
  units?: string;
  preferred_collection_date?: string;
  scrap_types?: string;
  contact_name?: string;
  contact_number?: string;
  address?: string;
  frequency?: string;
  company_name?: string;
  department?: string;
  ewaste_types?: string;
  quantity?: string;
  preferred_pickup_date?: string;
  responsible_person?: string;
  contact_info?: string;
  office_address?: string;
  institution_name?: string;
  institution_type?: string;
  event_type?: string;
  target_group?: string;
  preferred_date?: string;
  estimated_scrap_types?: string;
  coordinator?: string;
  contact?: string;
  institution_address?: string;
};

const SolutionFormModal = ({
  isOpen,
  onClose,
  category,
}: SolutionFormModalProps) => {
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors([]); // Clear errors when user makes changes
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (category === "Residential Apartments") {
      if (!formData.apartment_name?.trim())
        errors.push("Apartment name is required");
      if (!formData.contact_name?.trim())
        errors.push("Contact name is required");
      if (!formData.contact_number?.trim())
        errors.push("Contact number is required");
      if (!formData.address?.trim()) errors.push("Address is required");
      if (!formData.preferred_collection_date)
        errors.push("Collection date is required");
    } else if (category === "IT Companies/Bank Offices") {
      if (!formData.company_name?.trim())
        errors.push("Company name is required");
      if (!formData.contact_info?.trim())
        errors.push("Contact information is required");
      if (!formData.office_address?.trim())
        errors.push("Office address is required");
    } else if (category === "Schools & Colleges") {
      if (!formData.institution_name?.trim())
        errors.push("Institution name is required");
      if (!formData.institution_type)
        errors.push("Institution type is required");
      if (!formData.contact?.trim())
        errors.push("Contact information is required");
    }

    return errors;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!category) return;

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const insertData: CollectionRequestInsert = {
      category,
      apartment_name: "",
      units: null,
      preferred_collection_date: "",
      scrap_types: "",
      contact_name: "",
      contact_number: "",
      residential_address: "",
      frequency: "",
      // company_name is not part of the type definition
      company_name: "",
      department: "",
      ewaste_types: "",
      quantity: null,
      preferred_pickup_date: "",
      responsible_person: "",
      contact_info: "",
      office_address: "",
      institution_name: "",
      institution_type: "",
      event_type: "",
      target_group: "",
      preferred_date: "",
      coordinator: "",
      contact: "",
      institution_address: "",
      created_at: new Date().toISOString(),
      status: "pending",
    };

    try {
      if (category === "Residential Apartments") {
        if (
          !formData.apartment_name ||
          !formData.contact_name ||
          !formData.contact_number ||
          !formData.address ||
          !formData.preferred_collection_date
        ) {
          throw new Error("Missing required fields for Residential Apartments");
        }
        Object.assign(insertData, {
          apartment_name: formData.apartment_name,
          units: formData.units ? parseInt(formData.units) : null,
          preferred_collection_date: formData.preferred_collection_date,
          scrap_types: formData.scrap_types,
          contact_name: formData.contact_name,
          contact_number: formData.contact_number,
          residential_address: formData.address,
          frequency: formData.frequency,
        });
      } else if (category === "IT Companies/Bank Offices") {
        if (
          !formData.company_name ||
          !formData.contact_info ||
          !formData.office_address
        ) {
          throw new Error(
            "Missing required fields for IT Companies/Bank Offices"
          );
        }
        Object.assign(insertData, {
          company_name: formData.company_name,
          department: formData.department,
          ewaste_types: formData.ewaste_types,
          quantity: formData.quantity ? parseInt(formData.quantity) : null,
          preferred_pickup_date: formData.preferred_pickup_date,
          responsible_person: formData.responsible_person,
          contact_info: formData.contact_info,
          office_address: formData.office_address,
        });
      } else if (category === "Schools & Colleges") {
        if (
          !formData.institution_name ||
          !formData.institution_type ||
          !formData.contact
        ) {
          throw new Error("Missing required fields for Schools & Colleges");
        }
        Object.assign(insertData, {
          institution_name: formData.institution_name,
          institution_type: formData.institution_type,
          event_type: formData.event_type,
          target_group: formData.target_group,
          preferred_date: formData.preferred_date,
          coordinator: formData.coordinator,
          contact: formData.contact,
          institution_address: formData.institution_address,
        });
      }

      const { error } = await supabase
        .from("collection_requests")
        .insert([insertData]);

      if (error) throw error;
      setSubmitted(true);
      setErrors([]);
    } catch (error) {
      console.error("Submission error:", error);
      setErrors([
        `Error: ${error instanceof Error ? error.message : "Failed to submit"}`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    name: keyof FormData,
    type = "text",
    placeholder = "",
    required = false
  ) => (
    <div className="form-field">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {placeholder} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={`Enter ${placeholder.toLowerCase()}`}
        className="scrap-input w-full px-3 py-2 border border-gray-300 rounded-md"
        value={formData[name] || ""}
        onChange={handleChange}
        required={required}
        aria-label={placeholder}
        aria-required={required}
      />
    </div>
  );

  const renderTextarea = (
    name: keyof FormData,
    placeholder = "",
    required = false
  ) => (
    <div className="form-field">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {placeholder} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={`Enter ${placeholder.toLowerCase()}`}
        className="scrap-input w-full px-3 py-2 border border-gray-300 rounded-md"
        value={formData[name] || ""}
        onChange={handleChange}
        required={required}
        aria-label={placeholder}
        aria-required={required}
      />
    </div>
  );

  if (!isOpen || !category) return null;

  let formContent;

  if (category === "Residential Apartments") {
    formContent = (
      <div className="space-y-4">
        <h2 id="modal-title" className="text-2xl font-bold text-center">
          Schedule a Residential Scrap Collection Drive
        </h2>
        {renderInput("apartment_name", "text", "Apartment Name", true)}
        {renderInput("units", "number", "Number of Flats/Units")}
        {renderInput(
          "preferred_collection_date",
          "date",
          "Preferred Collection Date",
          true
        )}
        {renderInput(
          "scrap_types",
          "text",
          "Types of Scrap (Metal, Plastic, Paper, E-waste, etc.)",
          true
        )}
        {renderInput("contact_name", "text", "Point of Contact Name", true)}
        {renderInput("contact_number", "tel", "Contact Number", true)}
        {renderTextarea("address", "Location/Address", true)}
        <div className="form-field">
          <label
            htmlFor="frequency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Collection Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            className="scrap-input w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={handleChange}
            value={formData.frequency || ""}
          >
            <option value="">Select Frequency</option>
            <option>One-time</option>
            <option>Every 3 Months</option>
            <option>Every 6 Months</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>
    );
  } else if (category === "IT Companies/Bank Offices") {
    formContent = (
      <div className="space-y-4">
        <h2 id="modal-title" className="text-2xl font-bold text-center">
          Schedule a Bank/Company Scrap Collection Drive
        </h2>
        {renderInput("company_name", "text", "Company Name", true)}
        {renderInput("contact_info", "text", "Contact Information", true)}
        {renderInput("office_address", "text", "Office Address", true)}
        {renderInput("ewaste_types", "text", "Types of E-waste", true)}
        {renderInput("quantity", "number", "Quantity")}
        {renderInput("preferred_pickup_date", "date", "Preferred Pickup Date")}
        {renderInput("responsible_person", "text", "Responsible Person")}
      </div>
    );
  } else if (category === "Schools & Colleges") {
    formContent = (
      <div className="space-y-4">
        <h2 id="modal-title" className="text-2xl font-bold text-center">
          Schedule a School/College Scrap Collection Drive
        </h2>
        {renderInput("institution_name", "text", "Institution Name", true)}
        {renderInput("institution_type", "text", "Institution Type", true)}
        {renderInput("event_type", "text", "Event Type")}
        {renderInput("target_group", "text", "Target Group")}
        {renderInput("preferred_date", "date", "Preferred Date")}
        {renderInput("coordinator", "text", "Coordinator")}
        {renderInput("contact", "text", "Contact Information", true)}
        {renderInput("institution_address", "text", "Institution Address")}
      </div>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
      aria-labelledby="modal-title"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formContent}
              {errors.length > 0 && (
                <div className="text-red-500 text-sm" role="alert">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
              <Button
                type="submit"
                className="scrap-btn-primary w-full"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          ) : (
            <p className="text-center text-green-600" role="alert">
              Form submitted successfully!
            </p>
          )}
          <button
            onClick={onClose}
            className="text-red-500 mt-6 text-sm underline hover:opacity-80 block mx-auto"
            aria-label="Close modal"
          >
            Cancel
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SolutionFormModal;
