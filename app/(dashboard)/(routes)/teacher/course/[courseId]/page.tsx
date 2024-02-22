interface Props {
  params: { courseId: string };
}
const page = ({ params }: Props) => {
  return <div>courseId: {params.courseId} </div>;
};

export default page;
