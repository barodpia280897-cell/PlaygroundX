// src/pages/BusinessAnalytics.jsx
import { motion } from 'framer-motion';
import ConversionFunnel from '../components/dashboard/ConversionFunnel';
import BottomSection from '../components/dashboard/BottomSection';
import ReportHeaderBanner from '../components/reports/ReportHeaderBanner';

export default function BusinessAnalytics() {
  return (
    <div className="space-y-5 pb-10">
      <ReportHeaderBanner
        title="Business Conversion & Funnel Analytics"
        subtitle="Deep dive into funnel stage conversion rates and geographical distribution"
        measures="Measures stage-by-stage conversion drop-off, customer acquisition cost (CAC), and geographic market performance."
        audience="Growth Directors & Marketing Analysts"
      />

      {/* Row 1: Conversion Funnel full width or large width */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <ConversionFunnel />
        </div>
      </div>

      {/* Row 2: Bottom Section (Language / Top Countries) */}
      <BottomSection />

    </div>
  );
}
