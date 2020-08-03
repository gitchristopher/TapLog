using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace TapLog.Application.Common.Helper
{
    public static class StringCleaner
    {
        public static string CleanInput(string strIn)
        {
            if (String.IsNullOrEmpty(strIn))
            {
                return String.Empty;
            }
            // Replace invalid characters with empty strings.
            try
            {
                return Regex.Replace(strIn, @"[^\w\s\.$@-]", "",
                                     RegexOptions.None, TimeSpan.FromSeconds(1.5));
            }
            // If we timeout when replacing invalid characters,
            // we should return Empty.
            catch (RegexMatchTimeoutException)
            {
                return String.Empty;
            }
        }
        public static bool HasBadCharacters(string strIn)
        {
            if (String.IsNullOrEmpty(strIn))
            {
                return false;
            }
            // Finds invalid characters.
            try
            {
                return Regex.IsMatch(strIn, @"[^\w\s\.$@-]",
                                     RegexOptions.None, TimeSpan.FromSeconds(1.5));
            }
            // If we timeout when replacing invalid characters,
            // we should return Empty.
            catch (RegexMatchTimeoutException)
            {
                return true;
            }
        }
    }
}


