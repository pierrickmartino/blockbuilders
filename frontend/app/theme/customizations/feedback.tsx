import { Theme, alpha, Components } from '@mui/material/styles';
import { gray, orange } from '../themePrimitives';

/* eslint-disable import/prefer-default-export */
export const feedbackCustomizations: Components<Theme> = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 10,
        filledSuccess: {
          color: "white",
        },
        filledInfo: {
          color: "white",
        },
        filledError: {
          color: "white",
        },
        filledWarning: {
          color: "white",
        },
        standardSuccess: {
          backgroundColor: "hsl(138, 76.50%, 96.70%)",
          color: "hsl(142, 70%, 29.20%)",
        },
        standardError: {
          backgroundColor: "hsl(0, 85.70%, 97.30%)",
          color: "hsl(0, 73.70%, 41.80%)",
        },
        standardWarning: {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.main,
        },
        standardInfo: {
          backgroundColor: theme.palette.info.light,
          color: theme.palette.info.main,
        },
        outlinedSuccess: {
          borderColor: "hsl(142, 70%, 29.20%)",
          color: "hsl(142, 70%, 29.20%)",
        },
        outlinedWarning: {
          borderColor: theme.palette.warning.main,
          color: theme.palette.warning.main,
        },
        outlinedError: {
          borderColor: "hsl(0, 73.70%, 41.80%)",
          color: "hsl(0, 73.70%, 41.80%)",
        },
        outlinedInfo: {
          borderColor: theme.palette.info.main,
          color: theme.palette.info.main,
        },
        // backgroundColor: orange[100],
        // color: (theme).palette.text.primary,
        // border: `1px solid ${alpha(orange[300], 0.5)}`,
        // '& .MuiAlert-icon': {
        //   color: orange[500],
        // },
        ...theme.applyStyles('dark', {
          filledSuccess: {
            color: "white",
          },
          filledInfo: {
            color: "white",
          },
          filledError: {
            color: "white",
          },
          filledWarning: {
            color: "white",
          },
          standardSuccess: {
            backgroundColor: theme.palette.success.light,
            color: theme.palette.success.main,
          },
          standardError: {
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.main,
          },
          standardWarning: {
            backgroundColor: theme.palette.warning.light,
            color: theme.palette.warning.main,
          },
          standardInfo: {
            backgroundColor: theme.palette.info.light,
            color: theme.palette.info.main,
          },
          outlinedSuccess: {
            borderColor: theme.palette.success.main,
            color: theme.palette.success.main,
          },
          outlinedWarning: {
            borderColor: theme.palette.warning.main,
            color: theme.palette.warning.main,
          },
          outlinedError: {
            borderColor: theme.palette.error.main,
            color: theme.palette.error.main,
          },
          outlinedInfo: {
            borderColor: theme.palette.info.main,
            color: theme.palette.info.main,
          },
          // backgroundColor: `${alpha(orange[900], 0.5)}`,
          // border: `1px solid ${alpha(orange[800], 0.5)}`,
        }),
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiDialog-paper': {
          borderRadius: '10px',
          border: '1px solid',
          borderColor: (theme).palette.divider,
        },
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 8,
        borderRadius: 8,
        backgroundColor: gray[200],
        ...theme.applyStyles('dark', {
          backgroundColor: gray[800],
        }),
      }),
    },
  },
};