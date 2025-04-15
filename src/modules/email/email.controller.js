import template from '../../utils/template.js';
import EmailService from './email.service.js';

class EmailController {
	async sendVerificationEmail(req, res, next) {
		try {
			await EmailService.sendVerificationEmail(req.user);

			res.status(200).json({ message: 'Verification email sent successfully' });
		} catch (err) {
			next(err);
		}
	}

	async report(req, res, next) {
		try {
			await EmailService.reportAdmin(req.body);

			res.status(200).json({ message: 'Report sent successfully' });
		} catch (err) {
			next(err);
		}
	}

	async verify(req, res) {
		try {
			const { token } = req.params;

			await EmailService.verify(token);

			res.send(template('email/verified.html'));
		} catch (err) {
			res.send(template('error/message.html').replace('{{message}}', err.message));
		}
	}
}

export default new EmailController();
