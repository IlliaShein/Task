using CsvHelper;
using CsvHelper.Configuration;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Task_.Models;

namespace Task_.Controllers
{
    public class HomeController : Controller
    {
        private readonly Context _context;

        public HomeController()
        {
            _context = new Context();
        }

        public ActionResult Index()
        {
            var contacts = _context.Contacts.ToList();
            return View(contacts);
        }

        [HttpPost]
        public ActionResult SaveContacts(List<Contact> contacts)
        {
            _context.Contacts.RemoveRange(_context.Contacts);
            _context.Database.ExecuteSqlCommand("DBCC CHECKIDENT('Contacts', RESEED, 0)");

            _context.Contacts.AddRange(contacts);
            _context.SaveChanges();

            return null;
        }

        [HttpPost]
        public ActionResult UploadCSV(HttpPostedFileBase file)
        {
            var conf = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = false,
                TrimOptions = TrimOptions.Trim,
                MissingFieldFound = null,
                HeaderValidated = null,
                Delimiter = ";"
            };

            if (file != null && file.ContentLength > 0)
            {
                using (var reader = new StreamReader(file.InputStream))
                {
                    using (var csv = new CsvReader(reader, conf))
                    {
                        var csvRecords= csv.GetRecords<CsvRecord>().ToList();

                        foreach (var csvRecord in csvRecords)
                        {
                            Contact contact = new Contact
                            {
                                Name = csvRecord.Name,
                                DateOfBirth = DateTime.ParseExact(csvRecord.DateOfBirth, "dd.MM.yyyy", CultureInfo.InvariantCulture),
                                Married = csvRecord.Married,
                                Phone = csvRecord.Phone,
                                Salary = csvRecord.Salary
                            };

                            _context.Contacts.Add(contact);
                        }

                        _context.SaveChanges();
                    }
                }
            }

            return RedirectToAction("Index");
        }
    }
}