using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Task_.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [Column(TypeName = "Date")]
        public DateTime DateOfBirth { get; set; }
        public bool Married { get; set; }
        public string Phone { get; set; }
        public decimal Salary { get; set; }
    }
}