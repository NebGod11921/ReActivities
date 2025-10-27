﻿using Application.Activities.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities.Validators
{
    public class CreateActivityValidator : AbstractValidator<CreateActivity.Command>
    {
        public CreateActivityValidator()
        {
            RuleFor(x => x.ActivityDto.Title).NotEmpty().WithMessage("Title is required");
            RuleFor(x => x.ActivityDto.Description).NotEmpty().WithMessage("Description is required");
        }

    }
}
