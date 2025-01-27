// student/page.ts

'use client';

import { SetStateAction, useEffect, useState } from 'react';
import { CardConfidenceVisualizer } from '@/app/ui/dashboard/cards/general/card-confidence';
import useMidasStore, { SchoolData } from '@/hooks/useSchoolData';
import { calculateModeConfidence, calculateOccurancePercentages, calculateRiskByDemographic, calculateRiskPercentages, calculateTestRiskPercentages } from '@/action/calculateRiskStatistics';
import { RiskCard } from '@/app/ui/dashboard/risk-card';
import { MidasRiskScoreTooltip } from '@/app/ui/textblocks/tooltips';
import { RiskCardWithConfidence } from '@/app/ui/dashboard/risk-confidence-card';
import { StudentSearch } from '@/app/ui/dashboard/cards/search/student-search';
import { getSession, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

interface SearchProps {
  searchParams: {
    studentId: string;
  };
}

export default function Page() {

  const [schoolId, setSchoolId] = useState<number>(0);

  const midasStore = useMidasStore();


  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);
  const [studentData, setStudentData] = useState<SchoolData[]>([]);

  const searchParams = useSearchParams();
  const studentSearchParam = searchParams.get("student");
  const [studentId, setStudentId] = useState<string | undefined>(studentSearchParam!);

  useEffect(() => {
    const getSchoolId = async () => {
      let session = await getSession();
      setSchoolId(session?.user.school_id);
    }

    getSchoolId()

    const school = midasStore.getStudentsBySchoolId(schoolId);
    console.log("Student data:", school);

    const student = midasStore.getStudentById(schoolId, studentId!)
    console.log("Individual Student data:", school);

    setSchoolData(school);
    setStudentData(student);
  }, [midasStore, studentId, schoolId]);


  //useEffect(() => {
  //  if (false) {
  //    console.log("studentId is not set yet");
  //    setStudentId(schoolData.map(student => student.studentid)[0]);
  //    console.log(studentId);
  //  }
  //  const school = midasStore.getStudentsBySchoolId(schoolId);
  //
  //  // todo)) This may cause a bug if there is a user with no associated data at all
  //  const student = midasStore.getStudentById(schoolId, studentId!)
  //  console.log("Individual Student data:", school);
  //
  //  setSchoolData(school);
  //  setStudentData(student);
  //}, [midasStore, studentId, schoolId]);

  // todo)) This is hacky and should be done differently, but it works for now.
  if (studentData[0] === undefined) {
    studentData[0] = {
      classroom: "",
      ell: "",
      ethnicity: "",
      gender: "",
      gradelevel: 0,
      math_f: "",
      mysaebrs_aca: "",
      mysaebrs_soc: "",
      mysaebrs_emo: "",
      odr_f: "",
      read_f: "",
      risk: {
        midas: {
          risklevel: "",
          confidence: ""
        },
        teacher: {
          risklevel: "",
          confidence: ""
        },
        student: {
          risklevel: "",
          confidence: ""
        }
      },
      saebrs_aca: "",
      saebrs_emo: "",
      saebrs_soc: "",
      school_id: 1,
      schoollevel: "",
      studentid: "",
      susp_f: ""
    }
  }
  const student = studentData[0];

  const dashboardData: StudentDashboardData = {
    midasRiskLabel: student?.risk.midas?.risklevel || "NA",
    teacherRiskLabel: student?.risk.teacher?.risklevel || "NA",
    studentRiskLabel: student?.risk.student?.risklevel || "NA",
    midasConfidence: student?.risk.midas?.confidence || "NA",
    odrLabel: student?.odr_f || "NA",
    suspLabel: student?.susp_f || "NA",
    ethnicity: student?.ethnicity || "NA",
    ell: student?.ell || "NA",
    gender: student?.gender || "NA",
    mathLabel: student?.math_f || "NA",
    readLabel: student?.read_f || "NA"
  };

  return (
    <main className="flex flex-col md:w-[70%] p-4 gap-4 mx-auto">
      <StudentSearch selectedStudent={studentId!} setSelectedStudent={setStudentId}
        data={{ gradeLevel: student.gradelevel.toString(), gender: student.gender, ethnicity: student.ethnicity, ell: student.ell }}
        studentList={schoolData.map(student => student.studentid)} />

      <div className="flex md:flex-row flex-col gap-4 md:justify-evenly w-full">
        <RiskCardWithConfidence
          title={'MIDAS Main Risk'}
          assessments={[
            {
              name: '',
              values: [dashboardData.midasRiskLabel],
              labels: [],
              tooltipContent: MidasRiskScoreTooltip()
            },
          ]}
          confidence={dashboardData.midasConfidence!}
          className="max-h-64 w-full"
        />


        <RiskCard
          title={'Teacher Sub-Risk'}
          assessments={[
            {
              name: '',
              values: [dashboardData.teacherRiskLabel],
              labels: [],
              tooltipContent: 'Sub risk'
            },
          ]}
          className="w-full"
        />
        <RiskCard
          title={'Student Sub-Risk'}
          assessments={[
            {
              name: '',
              values: [dashboardData.studentRiskLabel],
              labels: [],
              tooltipContent: 'Sub risk'
            },
          ]}
          className="w-full"
        />
      </div>

      {/* Row 2 */}
      <div className="flex lg:flex-row flex-col gap-4 justify-evenly">
        <RiskCard
          title={'Discipline Summary'}
          assessments={[
            {
              name: 'ODR',
              values: [dashboardData.odrLabel],
              labels: [],
              tooltipContent: 'ODR'
            },
            {
              name: 'Suspensions',
              values: [dashboardData.suspLabel],
              labels: [],
              tooltipContent: 'Suspensions'
            }
          ]}
          className="w-full"
        />

        <RiskCard
          title={'Test Risk Scores'}
          assessments={[
            {
              name: 'Math',
              values: [dashboardData.mathLabel],
              labels: [],
              tooltipContent: 'ODR'
            },
            {
              name: 'Reading',
              values: [dashboardData.readLabel],
              labels: [],
              tooltipContent: ''
            }
          ]}
          className="w-full"
        />
      </div>

    </main >

  );
}
