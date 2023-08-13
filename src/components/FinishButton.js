function FinishButton({ dispatch }) {
    return (

        <button className="btn btn-ui" onClick={() => dispatch({ type: "finishQuiz" })}>Finish</button>

    )
}

export default FinishButton
