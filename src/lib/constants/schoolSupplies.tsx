import { SupplyImage } from "@/features/desk/presentation/components";
import notebook from "@/assets/notebook.png";
import paperclip from "@/assets/paperclip.png";
import papers from "@/assets/papers.png";
import pencil from "@/assets/pencil.png";
import chalkboard from "@/assets/chalkboard.png";
import coloredPencils from "@/assets/colored-pencils.png";
import comingSoon from "@/assets/coming-soon.png";
import laughingFace from "@/assets/laughing-face.png";
import heartEyes from "@/assets/heart-eyes.png";
import thumbtack from "@/assets/thumbtack.png";

export const notebookSupplies = [
  {
    id: "papers",
    className: "left-4 bottom-12",
    rest: { y: 50, rotate: -10, scale: 0.9 },
    hover: { y: 100, rotate: 30, scale: 1 },
    children: <SupplyImage src={papers} alt="Papers" className="relative h-20 w-16" />,
  },
  {
    id: "notebook",
    className: "left-16 bottom-13",
    rest: { y: 100, rotate: 30, scale: 0.9 },
    hover: { y: -17, rotate: 12, scale: 1 },
    children: <SupplyImage src={notebook} alt="Notebook" className="relative h-28 w-28" />,
  },
  {
    id: "paperclip",
    className: "left-30 bottom-13",
    rest: { y: 50, rotate: 18, scale: 0.82 },
    hover: { y: -10, rotate: 0, scale: 0.95 },
    children: <SupplyImage src={paperclip} alt="Paper clip" className="relative h-14 w-14" />,
  },
  {
    id: "pencil",
    className: "left-20 bottom-5",
    rest: { y: 30, rotate: -60, scale: 0.82 },
    hover: { y: 0, rotate: 10, scale: 0.95 },
    children: <SupplyImage src={pencil} alt="Pencil" className="relative h-24 w-24" />,
  },
];

export const chalkboardSupplies = [
  {
    id: "chalkboard",
    className: "left-5 bottom-13 z-10",
    rest: { y: 20, rotate: -8, scale: 0.82 },
    hover: { y: -32, rotate: -16, scale: 0.96 },
    children: <SupplyImage src={chalkboard} alt="Chalkboard" className="relative h-30 w-30" />,
  },
  {
    id: "colored-pencils",
    className: "left-23 bottom-10 z-1",
    rest: { y: 50, rotate: 0, scale: 0.82 },
    hover: { y: 10, rotate: -10, scale: 0.98 },
    children: <SupplyImage src={coloredPencils} alt="Colored pencils" className="relative h-17 w-17" />,
  },
  
  
  {
    id: "laughing-face",
    className: "left-22 bottom-7",
    rest: { y: 70, rotate: 16, scale: 0.7 },
    hover: { y: -20, rotate: 4, scale: 0.86 },
    children: <SupplyImage src={laughingFace} alt="Laughing face" className="relative h-13 w-13" />,
  },
  {
    id: "heart-eyes",
    className: "left-0 bottom-11",
    rest: { y: 20, rotate: 0, scale: 0.72 },
    hover: { y: 0, rotate: 0, scale: 0.88 },
    children: <SupplyImage src={heartEyes} alt="Heart eyes" className="relative h-13 w-13" />,
  },
];

export const studyRoomsSupplies = [
  {
    id: "study-rooms",
    className: "left-5 bottom-13 z-10",
    rest: { y: 0, rotate: -45, scale: 0.82 },
    hover: { y: -32, rotate: -16, scale: 0.96 },
    children: <SupplyImage src={comingSoon} alt="Study rooms" className="relative h-20 w-20" />,
  },
  {
    id: "thumbtack",
    className: "left-5 bottom-13 z-10",
    rest: { y: 50, rotate: -45, scale: 0.82 },
    hover: { y: -32, rotate: -16, scale: 0.96 },
    children: <SupplyImage src={thumbtack} alt="Thumbtack" className="relative h-10 w-10" />,
  },
];
export const burningQuestionsSupplies = [
{
  id: "burning-questions",
  className: "left-5 bottom-13 z-10",
  rest: { y: 0, rotate: -45, scale: 0.82 },
  hover: { y: -32, rotate: -16, scale: 0.96 },
  children: <SupplyImage src={comingSoon} alt="Burning questions" className="relative h-20 w-20" />,
},
{
  id: "thumbtack",
  className: "left-5 bottom-13 z-10",
  rest: { y: 50, rotate: -45, scale: 0.82 },
  hover: { y: -44, rotate: -16, scale: 0.96 },
  children: <SupplyImage src={thumbtack} alt="Thumbtack" className="relative h-10 w-10" />,
},
];