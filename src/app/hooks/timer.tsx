import { Box, Typography } from "@mui/material";
import { ReactElement, useCallback, useMemo, useState } from "react";

export function useTimer() {
  const [seconds, setSeconds] = useState(0);

  const [timerClearout, setTimerClearout] = useState<NodeJS.Timeout>();

  const resetTimer = useCallback(() => {
    setSeconds(0);
    clearInterval(timerClearout);
    setTimerClearout(
      setInterval(() => {
        setSeconds((x) => (x + 1) % 3600);
      }, 1000)
    );
  }, [timerClearout]);

  const pauseTimer = useCallback(() => {
    clearInterval(timerClearout);
  }, [timerClearout]);

  const minutes = useMemo(() => Math.floor(seconds / 60), [seconds]);

  const secondsToDisplay = useMemo(() => seconds % 60, [seconds]);

  const timerComp: ReactElement = (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      sx={{
        border: 2,
        borderColor: "black",
        borderRadius: 2,
        backgroundColor: "white",
        m: 1,
        p: 1,
      }}
    >
      <Typography color="black">
        {minutes > 9 ? minutes : "0" + minutes.toString()}
      </Typography>
      <Typography color="black">:</Typography>
      <Typography color="black">
        {secondsToDisplay > 9
          ? secondsToDisplay
          : "0" + secondsToDisplay.toString()}
      </Typography>
    </Box>
  );

  return { timerComp, resetTimer, pauseTimer };
}
