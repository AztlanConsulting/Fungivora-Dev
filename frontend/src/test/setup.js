import '@testing-library/jest-dom'

vitest.spyOn(console, 'error').mockImplementation(() => { });