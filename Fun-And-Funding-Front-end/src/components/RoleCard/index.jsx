/* eslint-disable react/prop-types */
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

function RoleCard({ Img, Title, Description, onClick }) {
  return (
    <Card>
      {/* Attach the onClick prop to CardActionArea */}
      <CardActionArea className="w-[15.625rem]" onClick={onClick}>
        <CardMedia
          sx={{ height: "12.5rem !important", mt: "1rem", width: "100%" }}
          component="img"
          alt={`${Title} image`}
          image={Img}
        />
        <CardContent>
          <Typography
            sx={{ fontWeight: "bold", textAlign: "center" }}
            gutterBottom
            variant="h5"
            component="div"
          >
            {Title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", textAlign: "center" }}
          >
            {Description}
          </Typography>
          {/* Sign In Button */}
          <button
            type="button" // Change to type="button"
            className="w-full bg-[#1BAA64] font-semibold text-white py-3 rounded-lg mt-6 hover:bg-green-600 transition-all duration-200"
          >
            Become a {Title}
          </button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RoleCard;
