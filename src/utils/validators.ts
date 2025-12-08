export const validators = {
  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;
    return passwordRegex.test(password);
  },

  validateInput(value: string): boolean {
    // Very simple email/phone heuristic; you can refine later.
    if (!value) return false;
    const emailRegex = /.+@.+\..+/;
    const phoneRegex = /^[0-9+\-()\s]{6,}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  },
};
