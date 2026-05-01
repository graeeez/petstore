import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './App.css'
import ListingPage from './pages/ListingPage'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
})

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2d5a3d',
      light: '#3d7a52',
      dark: '#1f4d31',
    },
    secondary: {
      main: '#d4a017',
      light: '#e8b633',
      dark: '#b88a0f',
    },
    background: {
      default: '#f8f6f1',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ListingPage />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
