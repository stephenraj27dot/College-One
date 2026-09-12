"use client";

import { useState } from "react";
import { DetailedCollege, DetailedCollegeCourse } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuidanceModal } from "@/components/guidance/GuidanceModal";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

interface CollegeCoursesListProps {
  college: DetailedCollege;
}

export function CollegeCoursesList({ college }: CollegeCoursesListProps) {
  const [selectedCourse, setSelectedCourse] = useState<DetailedCollegeCourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyClick = (course: DetailedCollegeCourse) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const courses = college.courses || [];

  return (
    <>
      <Card className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-xl font-extrabold text-slate-900">
              Offered Courses & Seat Intake
            </h2>
            <p className="text-xs text-slate-500">
              Verified TNEA & Anna University Approved Programs
            </p>
          </div>
          <Badge variant="default" className="text-xs font-bold">
            {courses.length} Programs
          </Badge>
        </div>

        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.id || course.course_name}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    {course.degree_level} • {course.duration_years} Years
                  </Badge>
                  <span className="text-xs text-emerald-600 font-semibold">
                    {course.study_mode || "Full Time"}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  {course.course_name}
                </h4>
                <p className="text-xs text-slate-500">
                  Intake:{" "}
                  <strong className="text-slate-800 font-bold">
                    {course.intake_capacity || "Available"} Seats
                  </strong>{" "}
                  | Eligibility: {course.eligibility || "12th Standard (PCM / Merit)"}
                </p>
              </div>

              {/* Green Apply Button replacing tuition fee placeholder */}
              <div className="flex items-center justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                <Button
                  onClick={() => handleApplyClick(course)}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-emerald-600/30 transition-all flex items-center gap-1.5 border-0 cursor-pointer"
                >
                  <span>Apply</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Interactive Guidance & Application Modal */}
      {isModalOpen && (
        <GuidanceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCourse(null);
          }}
          targetCollege={college}
          targetCourseName={selectedCourse?.course_name || undefined}
        />
      )}
    </>
  );
}
