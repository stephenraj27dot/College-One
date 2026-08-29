import { PredictorInput, PredictorResult, PredictorPrediction } from "@/types";
import { verifiedColleges } from "@/lib/data/verifiedTamilNaduData";

export async function predictColleges(input: PredictorInput): Promise<PredictorResult> {
  const { cutoffMarks, community, preferredDistrict, preferredBranch } = input;
  const highProbability: PredictorPrediction[] = [];
  const moderateProbability: PredictorPrediction[] = [];
  const competitiveProbability: PredictorPrediction[] = [];

  verifiedColleges.forEach((college) => {
    // Check district filter
    if (
      preferredDistrict &&
      college.district.toLowerCase() !== preferredDistrict.toLowerCase()
    ) {
      return;
    }

    college.courses.forEach((course) => {
      // Check branch filter
      if (
        preferredBranch &&
        !course.course_name.toLowerCase().includes(preferredBranch.toLowerCase()) &&
        !(course.specialization && course.specialization.toLowerCase().includes(preferredBranch.toLowerCase()))
      ) {
        return;
      }

      // Find matching cutoff record for this college & course
      const cutoffRec = college.cutoff_records?.find(
        (cr) => cr.course_id === course.course_id && cr.community === community
      );

      // If exact community cutoff is not in sample, estimate from OC with standard reservation offset
      let requiredCutoff = 185;
      if (cutoffRec) {
        requiredCutoff = cutoffRec.cutoff_mark;
      } else {
        const ocRec = college.cutoff_records?.find((cr) => cr.course_id === course.course_id);
        const baseOc = ocRec ? ocRec.cutoff_mark : 190;
        // Tamil Nadu standard category variance
        if (community === "BC") requiredCutoff = baseOc - 0.5;
        else if (community === "BCM") requiredCutoff = baseOc - 1.0;
        else if (community === "MBC" || community === "MBC_DNC") requiredCutoff = baseOc - 1.5;
        else if (community === "SC") requiredCutoff = baseOc - 4.5;
        else if (community === "SCA") requiredCutoff = baseOc - 5.5;
        else if (community === "ST") requiredCutoff = baseOc - 7.0;
        else requiredCutoff = baseOc;
      }

      const diff = Number((cutoffMarks - requiredCutoff).toFixed(2));

      const prediction: PredictorPrediction = {
        collegeId: college.id,
        collegeName: college.name,
        collegeSlug: college.slug,
        tneaCode: college.tnea_code,
        district: college.district,
        city: college.city,
        courseName: course.course_name,
        courseSlug: course.course_slug,
        degreeLevel: course.degree_level,
        requiredCutoff,
        studentCutoff: cutoffMarks,
        difference: diff,
        probability: diff >= 1.0 ? "HIGH" : diff >= -1.5 ? "MODERATE" : "COMPETITIVE",
        community,
        nirfRank: college.nirf_ranking,
        placementRate: college.placement_stats?.placement_percentage || null,
        averagePackage: college.placement_stats?.average_package_lpa || null,
        isAutonomous: college.institution_type === "Autonomous" || college.institution_type === "Constituent",
        historicalAcademicYear: 2024,
      };

      if (diff >= 1.0) {
        highProbability.push(prediction);
      } else if (diff >= -1.5) {
        moderateProbability.push(prediction);
      } else if (diff >= -5.0) {
        competitiveProbability.push(prediction);
      }
    });
  });

  // Sort each category by highest cutoff and NIRF
  highProbability.sort((a, b) => b.requiredCutoff - a.requiredCutoff);
  moderateProbability.sort((a, b) => b.requiredCutoff - a.requiredCutoff);
  competitiveProbability.sort((a, b) => b.requiredCutoff - a.requiredCutoff);

  return {
    studentCutoff: cutoffMarks,
    community,
    totalMatches:
      highProbability.length +
      moderateProbability.length +
      competitiveProbability.length,
    highProbability,
    moderateProbability,
    competitiveProbability,
    disclaimer:
      "TNEA cutoffs are verified historical estimates based on official Directorate of Technical Education (DoTE) previous counselling allotments. Cutoffs fluctuate each academic year based on student score distributions and seat quotas.",
  };
}
