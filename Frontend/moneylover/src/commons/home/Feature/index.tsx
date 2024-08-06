interface props {
  img: string;
  title: string;
  detail: string;
}
const Feature: React.FC<props> = ({ img, title, detail }) => {
  return (
    <>
      <div className="text-center flex flex-col justify-center">
        <div className="flex justify-center">
          <img src={img} alt="" className="object-contain p-2" />
        </div>
        <p className="font-bold text-xl pt-3">{title}</p>
        <span className="line-clamp-2 text-center text-lg pt-1">{detail}</span>
      </div>
    </>
  );
};

export default Feature;
