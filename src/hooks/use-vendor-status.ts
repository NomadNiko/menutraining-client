import { useState, useEffect, useCallback } from "react";
import { VendorStatus } from "../types/vendor-status";
import { Template } from "../types/template";
import { ProductItem } from "../types/product-item";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

interface TemplateResponse {
  data: Template[];
  message?: string;
}

interface ProductResponse {
  data: ProductItem[];
  message?: string;
}

export function useVendorStatus(userId: string) {
  const [vendor, setVendor] = useState<VendorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVendorStatus = useCallback(async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error("No auth token");
      }

      const vendorResponse = await fetch(
        `${API_URL}/v1/vendors/user/${userId}/owned`,
        {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`,
          },
        }
      );

      if (!vendorResponse.ok) throw new Error("Failed to fetch vendor status");
      const vendorData = await vendorResponse.json();

      if (vendorData.data.length > 0) {
        const currentVendor = vendorData.data[0];

        // Fetch templates
        const templatesResponse = await fetch(
          `${API_URL}/product-templates/by-vendor/${currentVendor._id}`,
          {
            headers: {
              Authorization: `Bearer ${tokensInfo.token}`,
            },
          }
        );
        const templatesData: TemplateResponse = await templatesResponse.json();

        // Fetch products
        const productsResponse = await fetch(
          `${API_URL}/product-items/by-vendor/${currentVendor._id}`,
          {
            headers: {
              Authorization: `Bearer ${tokensInfo.token}`,
            },
          }
        );
        const productsData: ProductResponse = await productsResponse.json();

        // Create map of template IDs to whether they have items
        const templateItemMap = productsData.data.reduce(
          (acc: Record<string, boolean>, product) => {
            acc[product.templateId] = true;
            return acc;
          },
          {}
        );

        // Make sure we include isStripeSetupComplete in the vendor object
        setVendor({
          ...currentVendor,
          hasTemplates: templatesData.data.length > 0,
          hasProducts: productsData.data.length > 0,
          templates: templatesData.data.map((template) => ({
            _id: template._id,
            templateName: template.templateName,
            hasItems: !!templateItemMap[template._id],
          })),
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error loading vendor status:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadVendorStatus();
    }
  }, [userId, loadVendorStatus]);

  return { vendor, loading, error, refreshStatus: loadVendorStatus };
}
