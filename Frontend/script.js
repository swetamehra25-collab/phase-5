
const questionInput = document.getElementById("question");
const submitBtn = document.getElementById("submitBtn");
const answer = document.getElementById("answer");

submitBtn.addEventListener("click", async () => {

    const question = questionInput.value;

    if (!question) {
        answer.innerText = "Please enter a question";
        return;
    }

    answer.innerText = "Thinking...";

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        answer.innerText = data.message;

    } catch (error) {
        console.log(error);
        answer.innerText = "Something went wrong";
    }
});

