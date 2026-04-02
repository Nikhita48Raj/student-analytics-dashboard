export const getStudentRecordKey = (student) => student?.recordId ?? student?.id ?? '';

export const getStudentOptionLabel = (student) => {
  if (!student) {
    return '';
  }

  return `${student.name} (${student.id}) - ${student.subject} / Sem ${student.semester}`;
};
