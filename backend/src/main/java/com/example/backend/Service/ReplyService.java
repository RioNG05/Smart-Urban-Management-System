import com.example.backend.Entity.Reply;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Repository.ReplyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final ComplaintRepository complaintRepository;
    private final AccountRepository accountRepository;

    public ReplyService(ReplyRepository replyRepository,
                        ComplaintRepository complaintRepository,
                        AccountRepository accountRepository) {
        this.replyRepository = replyRepository;
        this.complaintRepository = complaintRepository;
        this.accountRepository = accountRepository;
    }

    public List<Reply> findAll() {
        return replyRepository.findAll();
    }
}