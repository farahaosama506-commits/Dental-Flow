"use client";

import React, { useState, useEffect } from "react";
import { treatmentsList } from "@/data/treatmentsData";
import PageHeader from "@/components/ui/PageHeader";

const TreatmentsPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    if (!mounted) return price.toString();
    return price.toLocaleString("ar-SA");
  };

  const categories = new Set(treatmentsList.map((t) => t.category)).size;
  const avgPrice = Math.round(
    treatmentsList.reduce((acc, t) => acc + t.price, 0) / treatmentsList.length
  );
  const popularCount = treatmentsList.filter((t) => t.popular).length;

  return (
    <div>
      <PageHeader
        title="العلاجات"
        subtitle="العلاجات السنية المتاحة والأسعار"
        icon="fa-tooth"
        action={
          <button className="px-5 py-2.5 bg-green-soft hover:bg-teal text-white font-semibold rounded-button text-sm">
            <i className="fas fa-plus-circle me-2"></i>إضافة علاج
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-card p-4 shadow-card border border-gray-50">
          <p className="text-sm text-gray-secondary">مجموع العلاجات</p>
          <p className="text-2xl font-bold text-navy">{treatmentsList.length}</p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card border border-gray-50">
          <p className="text-sm text-gray-secondary">الفئات</p>
          <p className="text-2xl font-bold text-navy">{categories}</p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card border border-gray-50">
          <p className="text-sm text-gray-secondary">متوسط السعر</p>
          <p className="text-2xl font-bold text-navy">
            {mounted ? `${avgPrice.toLocaleString("ar-SA")} $` : `$${avgPrice}`}
          </p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card border border-gray-50">
          <p className="text-sm text-gray-secondary">علاجات شائعة</p>
          <p className="text-2xl font-bold text-navy">{popularCount}</p>
        </div>
      </div>

      {/* Treatments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {treatmentsList.map((treatment) => (
          <div key={treatment.id} className="bg-white rounded-card shadow-card border border-gray-50 p-5">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${treatment.color}15` }}
              >
                <i className="fas fa-tooth text-xl" style={{ color: treatment.color }}></i>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{treatment.name}</h3>
                    <span className="text-xs text-teal font-semibold">{treatment.category}</span>
                  </div>
                  <div className="text-start">
                    <p className="text-xl font-bold text-navy">
                      {mounted ? `${formatPrice(treatment.price)} $` : `$${treatment.price}`}
                    </p>
                    {treatment.popular && (
                      <span className="text-xs bg-teal-light text-teal px-2 py-0.5 rounded-full font-semibold">شائع</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-secondary mt-2">{treatment.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-secondary">
                  <span className="flex items-center gap-1">
                    <i className="far fa-clock"></i> {treatment.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreatmentsPage;