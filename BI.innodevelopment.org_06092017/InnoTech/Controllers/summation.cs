using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InnoTech.Controllers
{
    public class summation 
    {
#region Attributes
        public int num1;
        public int num2;
        public int sum;
#endregion


#region Constractor
        public summation()
        {
            num1 = 1;
            num2 = 2;
            sum = 0;
        }
#endregion

#region Summation operation
        public void summ()
        {
            sum = num1 + num2;
        }
#endregion


    }
}