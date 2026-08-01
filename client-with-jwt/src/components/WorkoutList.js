import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { API_URL } from "../api";

function WorkoutList() {
  const [workouts, setWorkouts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/workouts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => {
        if (r.ok) {
          r.json().then((data) => setWorkouts(data.workouts));
        } else {
          r.json().then((err) => setError(err.error || "Failed to load workouts"));
        }
      })
      .catch(() => setError("Failed to load workouts"));
  }, []);

  if (error) return <ErrorText>{error}</ErrorText>;
  if (workouts === null) return <p>Loading workouts...</p>;
  if (workouts.length === 0) return <p>No workouts logged yet.</p>;

  return (
    <Wrapper>
      <h2>Your Workouts</h2>
      <List>
        {workouts.map((w) => (
          <Card key={w.id}>
            <CardHeader>
              <Title>{w.title}</Title>
              <Category>{w.category}</Category>
            </CardHeader>
            {w.description && <Description>{w.description}</Description>}
            <Meta>
              {w.duration_minutes} min &middot; {w.date_logged}
            </Meta>
          </Card>
        ))}
      </List>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 700px;
  margin: 24px auto;
  padding: 0 16px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
`;

const Category = styled.span`
  font-size: 0.8rem;
  text-transform: uppercase;
  color: deeppink;
  font-weight: bold;
`;

const Description = styled.p`
  margin: 8px 0 0;
  color: #555;
`;

const Meta = styled.p`
  margin: 8px 0 0;
  font-size: 0.85rem;
  color: #888;
`;

const ErrorText = styled.p`
  color: crimson;
  text-align: center;
`;

export default WorkoutList;
