WanderMind is an AI-powered travel planner that helps users design personalized trips. It suggests destinations, builds itineraries, finds attractions, and adapts to user preferences. Behind the scenes, it demonstrates prompting strategies, embeddings, vector databases, and similarity search (as required in your task list).

🧠 Features (Mapped to Your Rubric)

One-shot prompting

Ask: “Plan a 3-day trip to Paris” → get a full itinerary in one response.

Multi-shot prompting

Provide conversation history (preferences, budget, etc.) → AI refines the plan step by step.

Dynamic prompting

Adjusts based on user mood (“luxury travel”, “budget-friendly”, “adventure trip”).

Chain-of-thought prompting

For multi-step reasoning, e.g., selecting flights, then hotels, then attractions.

Evaluation dataset & testing framework

Test with a small dataset (5 trips) comparing expected vs. actual itineraries.

Tokens & tokenization logging

Log token count for each travel query.

Temperature control

Low temperature → factual itineraries.

High temperature → creative/fun itineraries.

Top P

Control randomness in destination suggestions.

Top K

Limit suggestions to “Top 3 attractions in Tokyo”.

Stop sequence

End output after “Day 3” in an itinerary.

Structured output

JSON format: {day, destination, activity, notes}.

Function calling

Functions like get_flights(city), get_hotels(city), get_attractions(city).

Embeddings

Convert travel guides into embeddings for semantic search.

Vector database

Store destinations/attractions for quick retrieval.

Cosine similarity

Find destinations similar to “Bali” (e.g., Phuket, Maldives).

L2 Distance similarity

Compare embeddings for “Rome food tour” vs. “Paris culinary experience.”

Dot product similarity

Rank user query against multiple attraction vectors.

👥 Who It’s For

Tourists planning vacations.

Travel bloggers curating itineraries.

Students or professionals who want weekend trip ideas.