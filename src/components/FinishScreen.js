function FinishScreen({ points, totalPoints, highscore }) {
    let percentage = Math.ceil(points / totalPoints * 100);
    let emoji;
    if (percentage === 100) {
        emoji = "🥇"
    } else if (percentage >= 80) {
        emoji = "🎉"
    } else if (percentage >= 60) {
        emoji = "👍"
    } else {
        emoji = "🥹"
    }

    return (
        <>
            <div className="result">
                <p><span>{emoji}</span>You scored <span>{points}</span> out of {totalPoints} ({percentage}%)</p>
            </div>
            <div className="highscore">Highscore: {highscore} points</div>
        </>
    )
}

export default FinishScreen
