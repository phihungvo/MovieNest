package carevn.luv2code.MovieNest.custom_anotation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Arrays;

public class EnumValidator implements ConstraintValidator<ValidEnum, Enum<?>> {
    private Enum<?>[] validValues;

    @Override
    public void initialize(ValidEnum annotation) {
        validValues = annotation.enumClass().getEnumConstants();
    }

    @Override
    public boolean isValid(Enum<?> value, ConstraintValidatorContext context) {
        if (value == null) {
            return false; // Enum không được null
        }
        return Arrays.asList(validValues).contains(value);
    }
}
