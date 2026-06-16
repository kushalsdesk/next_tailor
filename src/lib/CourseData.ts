export interface Course {
  name: string;
  duration: string;
  fee: {
    admission: string;
    monthly: string;
    exam: string;
  };
  syllabus?: {
    [category: string]: string[];
  };
}

// Regular courses (excluding Diploma)
export const courses: Course[] = [
  {
    name: "Basic Tailoring Course",
    duration: "6 months",
    fee: {
      admission: "₹400",
      monthly: "₹500",
      exam: "₹800",
    },
    syllabus: {
      "Women's Wear": [
        "Six-line Petticoat",
        "A-line Nighty",
        "Kameez",
        "Salwar",
        "Churidar",
        "Plain Blouse",
        "Multi-panel Kurti",
        "Housecoat",
        "Night Suit",
        "Collar Blouse",
        "Pipin Blouse",
        "Angrakha Kurti",
        "Skirt",
        "Patch Work Kurti",
        "Choli Cut Blouse",
      ],
      "Children's Wear": [
        "A-line Frock",
        "Peni Frock",
        "Mekhiya Frock",
        "Umbrella Frock",
        "School Dress",
        "Sport Skirt",
        "2-Part Skirt",
        "Jacket",
        "Jump Suit",
        "Party Gown",
      ],
      "Men's Wear": [
        "Full-sleeve Shirt",
        "Half-sleeve Shirt",
        "Punjabi",
        "Pyjama",
        "Kalidar Kurta",
        "Brief",
        "Waist Coat",
        "Underwear",
      ],
      "Household Accessories": [
        "Pillow Cover",
        "Cushion Cover",
        "Apron",
        "Table Runner",
        "Book Cover",
        "Potli Bag",
      ],
    },
  },
  {
    name: "Blouse Designing Course",
    duration: "3 months",
    fee: {
      admission: "₹550",
      monthly: "₹500",
      exam: "₹800",
    },
    syllabus: {
      "Neck Designs": [
        "Round Neck Blouse",
        "Square Neck Blouse",
        "High Neck Blouse",
        "Choli-cut Blouse",
        "Halter Neck Blouse",
        "Spaghetti Strap Blouse",
        "Shirt Style Blouse",
        "One-Shoulder Blouse",
        "Cold-Shoulder Blouse",
        "Jewelled Neck Blouse",
        "Boat Neck Blouse",
        "V Neck Blouse",
        "Chinese Collar Blouse",
        "Peter-pan Blouse",
      ],
      "Sleeve Styles": [
        "Bell-sleeve Blouse",
        "Lace Blouse",
        "Puffed Sleeve Blouse",
        "Juliet Sleeve Blouse",
        "Balloon Sleeve Blouse",
        "Butterfly Sleeve Blouse",
      ],
    },
  },
  {
    name: "Kurti Designing Course",
    duration: "3 months",
    fee: {
      admission: "₹550",
      monthly: "₹500",
      exam: "₹800",
    },
    syllabus: {
      "Kurti Styles": [
        "A-line Kurti",
        "Designer Lace Kurti",
        "Anarkali Kurti",
        "Shirt Kurti",
        "Asymmetric Kurti",
        "Block Printed Kurti",
        "Embroidered Kurti",
        "Patch Work Kurti",
      ],
      "Sleeve Designs": [
        "Bell-sleeve Kurti",
        "Slit-sleeve Kurti",
        "Cape Sleeve Kurti",
      ],
      "Neck & Collar Designs": [
        "Boat Neck Kurti",
        "Raglan Kurti",
        "V-collar Kurti",
        "Tunic Kurti",
        "Cold-shoulder Kurti",
      ],
    },
  },
  {
    name: "Saree Designing Course",
    duration: "3 months",
    fee: {
      admission: "₹600",
      monthly: "₹650",
      exam: "₹800",
    },
    syllabus: {
      "Saree Types & Styles": [
        "Embroidery Designer Saree",
        "Block Printed Saree",
        "Mixed & Match Designer Saree",
        "Kantha Stitch Saree",
        "Gujarati Stitch Saree",
      ],
      "Borders & Pallu": [
        "Border Jewelled Saree",
        "Palti-Pallu Saree",
        "Stitch Work Saree",
      ],
    },
  },

  {
    name: "Recycle & Reuse Old Clothes",
    duration: "3 months",
    fee: {
      admission: "₹550",
      monthly: "₹500",
      exam: "₹800",
    },
    syllabus: {
      "Recycled Clothing": [
        "Pathwork Designer Dress",
        "Applique Dress",
        "Recreated Kurti",
        "Recreated BedSheet",
      ],
      "Accessories & Covers": [
        "Recycled Bags",
        "Recreated Pillow Covers",
        "Cushion Cover",
        "Table Runners",
        "Table Cloth",
        "Sofa Covers",
        "Book Cover",
        "Potli Bag",
      ],
      "Home & Decor": ["Wall Hanging", "Embroidery Jute Bags", "Purse"],
    },
  },
];

// Diploma Course as a separate object
export const diplomaCourse = {
  name: "Diploma in Tailoring and Dress Designing",
  duration: "1 year",
  fee: {
    admission: "₹650",
    monthly: "₹600",
    exam: "₹1000",
  },
  semesters: {
    "First Semester (Basic Tailoring)": {
      "Women's Wear": [
        "Six-line Petticoat",
        "A-line Nighty",
        "Kameez",
        "Salwar",
        "Churidar",
        "Plain Blouse",
        "Multi-panel Kurti",
        "Housecoat",
        "Night Suit",
        "Collar Blouse",
        "Pipin Blouse",
        "Angrakha Kurti",
        "Skirt",
        "Patch Work Kurti",
        "Choli Cut Blouse",
      ],
      "Children's Wear": [
        "A-line Frock",
        "Peni Frock",
        "Mekhiya Frock",
        "Umbrella Frock",
        "School Dress",
        "Sport Skirt",
        "2-Part Skirt",
        "Jacket",
        "Jump Suit",
        "Party Gown",
      ],
      "Men's Wear": [
        "Full-sleeve Shirt",
        "Half-sleeve Shirt",
        "Punjabi",
        "Pyjama",
        "Kalidar Kurta",
        "Brief",
        "Waist Coat",
        "Underwear",
      ],
      "Household Accessories": [
        "Pillow Cover",
        "Cushion Cover",
        "Apron",
        "Table Runner",
        "Book Cover",
        "Potli Bag",
      ],
    },
    "Second Semester (Advanced Designing)": {
      "Designer Blouse": [
        "Boat Neck Blouse",
        "Princess Cut Blouse",
        "Halter Neck Blouse",
        "Puffed Sleeve Blouse",
        "Jewelled Blouse",
      ],
      "Designer Kurti": [
        "Anarkali Kurti",
        "Straight Cut Kurti",
        "Asymmetrical Kurti",
        "Patch Work Kurti",
        "Block Printed Kurti",
      ],
      "Bottom Wear": [
        "Palazzo Pant",
        "Lace Pant",
        "Side Slit Pant",
        "Tulip Pant",
        "Patiala Pant",
      ],
      "Designer Gown": [
        "Tunic Dress",
        "Spaghetti Dress",
        "Designer Maxi",
        "Full-length Gown",
        "Little Black Dress",
      ],
    },
  },
};
