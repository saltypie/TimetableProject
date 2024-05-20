import smtplib
from email.message import EmailMessage
from email.mime.text import MIMEText
from pathlib import Path
import environ
import ssl
from django.core.mail import send_mail

env = environ.Env()
environ.Env.read_env()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
def send_email(to_email, subject, message, smtp_server='smtp.gmail.com', from_email='musivibejive21@gmail.com'):
    send_mail(subject, message, from_email, [to_email],fail_silently=False)
# def send_email(to_email, subject, message, smtp_server='smtp.gmail.com', from_email='musivibejive21@gmail.com'):
#     msg = MIMEText(message)
#     msg['Subject'] = subject
#     msg['From'] = from_email
#     msg['To'] = to_email
#     server=smtplib.SMTP(smtp_server,587)
#     server.starttls()
#     server.login(from_email, str(env("MAIL_PASSWORD"))) 
#     server.send_message(msg) 
#     server.quit()
# def send_email(to_email, subject, message, server='smtp.gmail.com', from_email='musivibejive21@gmail.com'):
#     msg = EmailMessage()
#     msg['Subject'] = subject
#     msg['From'] = from_email
#     msg['To'] = to_email
#     msg.set_content(message)

#     context = ssl.create_default_context()
#     # Establish a secure connection (SSL) and login into your email account
#     with smtplib.SMTP_SSL(server, 465,context=context) as smtp:
#         smtp.login(from_email, env("MAIL_PASSWORD")) 
#         smtp.sendmail(msg,to_email,msg.as_string())


