"use client";
import Swal from "sweetalert2";

/**
 * A reusable confirmation dialog using SweetAlert2.
 * @param {string} title - Dialog title
 * @param {string} text - Dialog message
 * @param {string} confirmText - Confirm button text
 * @param {string} cancelText - Cancel button text
 * @returns {Promise<boolean>} - true if confirmed, false if cancelled
 */
export const confirmDialog = async ({
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  confirmText = "Yes, delete it!",
  cancelText = "Cancel",
}: {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
}): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#5b7a9d", // Blue-gray color matching the page
    cancelButtonColor: "#6b7280", // Gray color
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    background: "#f3f4f6", // Light gray background
    color: "#1f2937", // Dark text color
    iconColor: "#5b7a9d", // Matching icon color
    customClass: {
      popup: "rounded-lg",
      confirmButton: "rounded-md px-4 py-2 font-medium",
      cancelButton: "rounded-md px-4 py-2 font-medium",
    },
    buttonsStyling: true,
  });

  return result.isConfirmed;
};