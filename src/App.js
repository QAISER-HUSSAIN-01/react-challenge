import { useEffect, useState, useCallback } from "react";
import "./App.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [data, setData] = useState([]);

  const getRequest = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await fetch("/assets/questions.json");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      const questionAnswers = data.map((question, index) => ({
        questionText: question.questionText,
        answer: formData.get(`answer_${index}`) || "",
      }));

      const response = await fetch("/save-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionAnswers),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }
      setSuccessMessage("Answers submitted successfully!");
      // e.target.reset();
    } catch (error) {
      console.error("Error submitting answers:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getRequest();
  }, [getRequest]);

  return (
    <Box
      onSubmit={(e) => handleSubmit(e)}
      component={"form"}
      sx={{
        margin: "auto",
        padding: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "700px",
      }}
    >
      <Typography variant="h4" marginBottom={2}>
        Interview Q/A
      </Typography>
      {isFetching ? (
        <Typography>Loading questions...</Typography>
      ) : (
        <Stack gap={2}>
          {data.map((question, index) => (
            <Card key={index}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Question {index + 1}
                </Typography>
                <Typography variant="body1">
                  {question.questionText}
                  {!question.optional ? (
                    <Box
                      component={"span"}
                      sx={{ color: "red", marginLeft: "5px" }}
                    >
                      *
                    </Box>
                  ) : (
                    <Box
                      component={"span"}
                      sx={{ color: "grey", marginLeft: "5px" }}
                    >
                      (optional)
                    </Box>
                  )}
                </Typography>
                <TextField
                  name={`answer_${index}`}
                  required={!question.optional}
                  placeholder="Write your answer..."
                  multiline
                  minRows={3}
                  fullWidth
                />
              </CardContent>
            </Card>
          ))}
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Stack>
      )}

      {successMessage && <Alert severity="success"> {successMessage}</Alert>}
    </Box>
  );
}

export default App;
